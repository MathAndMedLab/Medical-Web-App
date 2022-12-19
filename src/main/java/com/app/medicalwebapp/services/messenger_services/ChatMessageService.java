package com.app.medicalwebapp.services.messenger_services;

import com.app.medicalwebapp.controllers.requestbody.messenger.ChatFileRequest;
import com.app.medicalwebapp.controllers.requestbody.messenger.ChatMessageRequest;
import com.app.medicalwebapp.model.FileObject;
import com.app.medicalwebapp.model.FileObjectFormat;
import com.app.medicalwebapp.model.messenger_models.ChatMessage;
import com.app.medicalwebapp.model.messenger_models.StatusMessage;
import com.app.medicalwebapp.repositories.messenger_repositories.ChatMessageRepository;
import com.app.medicalwebapp.services.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final FileService fileService;

    @Autowired
    public ChatMessageService(ChatMessageRepository chatMessageRepository, FileService fileService){
        this.chatMessageRepository = chatMessageRepository;
        this.fileService = fileService;
    }

    /**
     * Сохранение отправленного сообщения в базу данных.
     */
    public ChatMessage save(ChatMessageRequest msg) throws Exception {
        List<FileObject> files = new ArrayList<>();

        // Если к сообщению прикреплены файлы, необходимо строку base64 декодировать в byte[] и отправить файл на сохранение.
        if (msg.getFiles() != null) {
            for (ChatFileRequest file : msg.getFiles()) {
                Base64.Decoder decoder = Base64.getDecoder();
                String fileBase64 = file.getFileContent().split(",")[1];
                byte[] decodedFileByte = decoder.decode(fileBase64);
                files.add(fileService.saveFile(file.getFileName(), decodedFileByte, msg.getSenderId(), msg.getUid()));
            }
        }
        String chatId;
        if (msg.getSenderName().compareTo(msg.getRecipientName()) < 0) {
            chatId = (msg.getSenderName() + msg.getRecipientName());
        } else {
            chatId = (msg.getRecipientName() + msg.getSenderName());
        }
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setChatId(chatId);
        chatMessage.setRecipientId(msg.getRecipientId());
        chatMessage.setSenderId(msg.getSenderId());
        chatMessage.setRecipientName(msg.getRecipientName());
        chatMessage.setSenderName(msg.getSenderName());
        chatMessage.setContent(msg.getContent());
        chatMessage.setStatusMessage(StatusMessage.UNREAD);
        chatMessage.setSendDate(msg.getSendDate());
        chatMessage.setTimeZone(msg.getTimeZone());
        chatMessage.setAttachments(files);
        chatMessage.setDeleted(false);
        var message = chatMessageRepository.save(chatMessage);

        // Необходимо воспользоваться функцией getImages(), и получить byte[] через функцию fileService.previewFile(),
        // так как иначе изображение не будет корректно отображено на клиенте.
        if (message.getAttachments().size() > 0) {
            getImages(List.of(message));
        }
        return message;
    }

    /**
     * Поиск всех сообщений между двумя пользователями.
     */
    public List<ChatMessage> findMessages(String senderUsername, String recipientUsername) throws Exception {
        String chatId;
        if (senderUsername.compareTo(recipientUsername) < 0) {
            chatId = (senderUsername + recipientUsername);
        } else {
            chatId = (recipientUsername + senderUsername);
        }
        List<ChatMessage> messages;
        Optional<List<ChatMessage>> messagesOptional = chatMessageRepository.findByChatIdAndDeleted(chatId, false);
        messages = messagesOptional.orElseGet(ArrayList::new);

        // Если сообщения были найдены, необходимо проверить наличие в них прикрепленных изображений.
        if (messages.size() > 0) {
            getImages(messages);
        }

        return messages;
    }

    /**
     * Функция устанавливает в объекты сообщений данные о UID и byte[]
     */
    public List<ChatMessage> getImages(List<ChatMessage> messages) throws Exception {
        for (ChatMessage message : messages) {
            if (message.getAttachments().size() > 0) {
                ArrayList<byte[]> data = new ArrayList<>();
                message.setImages(data);
                ArrayList<String> uid = new ArrayList<>();
                message.setUidFilesDicom(uid);
                for (int j = 0; j < message.getAttachments().size(); j++) {
                    var format = message.getAttachments().get(j).getFormat();
                    // Если к сообщению были прикреплены изображения, устанавливаем данные о byte[] и uid в поля объекта,
                    // но не сохраняем их в базу данных, так как в этом нет необходимости.

                    // Если это изображение, необходимо отправить byte[] для того, чтобы его отобразить на клиенте.
                    if (format == FileObjectFormat.DICOM ||
                            format == FileObjectFormat.JPEG ||
                            format == FileObjectFormat.PNG) {
                        FileObject fileObject = message.getAttachments().get(j);
                        byte[] fileContent = fileService.previewFile(fileObject);
                        message.getImages().add(fileContent);

                        // Если файл формата .dcm необходимо отправить данные о UID.
                        if (format == FileObjectFormat.DICOM) {
                            message.getUidFilesDicom().add(message.getAttachments().get(j).getUID());
                        }
                    }
                }
            }
        }
        return messages;
    }

    /**
     * Поиск непрочитанных сообщений.
     */
    public List<ChatMessage> findUnreadMessages(Long recipientId) {
        List<ChatMessage> messages;
        Optional<List<ChatMessage>> messagesOptional =
                chatMessageRepository.findByRecipientIdAndStatusMessageAndDeleted(recipientId, StatusMessage.UNREAD, false);
        messages = messagesOptional.orElseGet(ArrayList::new);
        return messages;
    }

    /**
     * Обновление статуса сообщений на READ (то есть сообщения были прочитаны)
     */
    public void updateUnreadMessages(List<ChatMessage> messages) {
        for (ChatMessage message : messages) {
            message.setStatusMessage(StatusMessage.READ);
            chatMessageRepository.save(message);
        }
    }

    private void delete(ChatMessage msg) {
        msg.setDeleted(true);
        chatMessageRepository.save(msg);
    }

    /**
     * Удаление сообщения.
     */
    public void deleteMessage(ChatMessage message) throws Exception {
        this.delete(message);
    }

    /**
     * Удаление сообщения с предварительным поиском нужного сообщения по времени отправления и chatId.
     */
    public void deleteMsgByTimeAndChatId(LocalDateTime time, String senderUsername, String recipientUsername) {
        String chatId;
        if (senderUsername.compareTo(recipientUsername) < 0) {
            chatId = (senderUsername + recipientUsername);
        } else {
            chatId = (recipientUsername + senderUsername);
        }
        ChatMessage messageToDelete = chatMessageRepository.findBySendDateAndChatId(time, chatId);
        this.delete(messageToDelete);
    }

    public Optional<ChatMessage> findFirstByChatIdOrderBySendDateDesc(String chatId) {
        return chatMessageRepository.findFirstByChatIdAndDeleted_IsFalseOrderByIdDesc(chatId);
    }

    public List<ChatMessage> findMessagesByKeywords(String senderUsername, String recipientUsername, String keywordsString) throws Exception {
        String[] keywords = keywordsString.split(" ");
        var allMessages = this.findMessages(senderUsername, recipientUsername);
        var foundMessages = new ArrayList<ChatMessage>();
        for (String keyword : keywords) {
            foundMessages.addAll(allMessages
                    .stream()
                    .filter(msg -> msg.getContent().contains(keyword))
                    .collect(Collectors.toList())
            );
        }
        return foundMessages;
    }

    /**
     * Поиск сообщения по времени отправления и chatId.
     */
    public ChatMessage getMsgByTimeAndChatId(LocalDateTime time, String senderName, String recipientName) {
        String chatId;
        if (senderName.compareTo(recipientName) < 0) {
            chatId = (senderName + recipientName);
        } else {
            chatId = (recipientName + senderName);
        }
        var count = 0;
        ChatMessage message = chatMessageRepository.findBySendDateAndChatId(time, chatId);
        while (message == null && count <= 1000) {
            message = chatMessageRepository.findBySendDateAndChatId(time, chatId);
            count++;
        }
        return message;
    }
}

