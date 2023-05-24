package com.app.medicalwebapp.controllers.messenger_controllers;

import com.app.medicalwebapp.controllers.requestbody.MessageResponse;
import com.app.medicalwebapp.controllers.requestbody.messenger.*;
import com.app.medicalwebapp.model.User;
import com.app.medicalwebapp.model.messenger_models.ChatMessage;
import com.app.medicalwebapp.model.messenger_models.ChatRoom;
import com.app.medicalwebapp.repositories.UserRepository;
import com.app.medicalwebapp.repositories.messenger_repositories.ChatMessageRepository;
import com.app.medicalwebapp.repositories.messenger_repositories.ChatRoomRepository;
import com.app.medicalwebapp.repositories.messenger_repositories.ContactsRepository;
import com.app.medicalwebapp.services.FileService;
import com.app.medicalwebapp.services.messenger_services.ChatMessageService;
import com.app.medicalwebapp.services.messenger_services.ContactsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Objects;

@CrossOrigin(origins = "*", maxAge = 604800)
@RestController
@RequestMapping("/api/msg")
public class ChatControllerHTTP {
    private final ChatMessageService chatMessageService;
    private final ContactsService contactsService;
    private final FileService fileService;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final ContactsRepository contactsRepository;
    private final ChatControllerWS chatControllerWS;
    private final ChatMessageRepository chatMessageRepository;
    public static final String CREATE_CHAT = "/create-group-chat";

    @Autowired
    public ChatControllerHTTP(ChatMessageService chatMessageService,
                              ContactsService contactsService,
                              FileService fileService,
                              ChatRoomRepository chatRoomRepository,
                              UserRepository userRepository,
                              ContactsRepository contactsRepository,
                              ChatControllerWS chatControllerWS, ChatMessageRepository chatMessageRepository) {
        this.chatMessageService = chatMessageService;
        this.contactsService = contactsService;
        this.fileService = fileService;
        this.chatRoomRepository = chatRoomRepository;
        this.userRepository = userRepository;
        this.contactsRepository = contactsRepository;
        this.chatControllerWS = chatControllerWS;
        this.chatMessageRepository = chatMessageRepository;
    }

    @PostMapping(CREATE_CHAT)
    @Transactional
    public ResponseEntity<?> createChat(@Valid @RequestBody GroupChatCreateRequest request) {
        try {
            List<User> members = new ArrayList<>();
            List<String> membersName = new ArrayList<>();
            if (request.getMembers() != null) {
                for (MemberRequest member : request.getMembers()) {
                    var user = userRepository.findByUsername(member.getMemberName());
                    if (user.isPresent()) {
                        members.add(user.get());
                        membersName.add(member.getMemberName());
                    }
                }
            }

            byte[] avatar = null;
            if (request.getAvatar() != null) {
                Base64.Decoder decoder = Base64.getDecoder();
                String fileBase64 = request.getAvatar().split(",")[1];
                avatar = decoder.decode(fileBase64);
            }

            ChatRoom chat = new ChatRoom();
            chat.setChatName(request.getChatName());
            chat.setAvatar(avatar);
            chat.setMembers(members);
            chat.setCreatorId(request.getCreatorId());
            chat.setCreatorName(request.getCreator());
            chatRoomRepository.save(chat);

            var savedChat = chatRoomRepository.findChatRoomByChatId(chat.getChatId());//Необходимо сохранять чат сначала,
            // а потом добавлять контактам чат в список чатов
            for (String name : membersName) {
                var contact = contactsRepository.findByContactsOwner(name);
                if (contact.isPresent()) {
                    var changedContact = contact.get();
                    List<ChatRoom> chats = changedContact.getChats();
                    chats.add(savedChat);
                    changedContact.setChats(chats);
                    contactsRepository.save(changedContact);
                }
            }
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setType(ChatMessage.MessageType.CREATE);
            chatMessage.setChatId(savedChat.getChatId());
            chatMessage.setContent("");
            chatMessage.setSenderName(request.getCreator());
            chatMessage.setSenderId(request.getCreatorId());
            chatMessage.setSendDate(request.getSendDate());
            chatMessage.setTimeZone(request.getTimeZone());
            var message = chatMessageRepository.save(chatMessage);

            chatControllerWS.sendNotificationMessage(message);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all/groupChats")
    public ResponseEntity<?> getChats(@RequestParam String memberName) {
        try {
            List<ChatRoom> chats = null;
            if (memberName != null) {
                var user = userRepository.findByUsername(memberName);
                chats = chatRoomRepository.findAllByMembersContains(user.get());
            }
            return ResponseEntity.ok().body(chats);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/groupChat")
    public ResponseEntity<?> getChat(@RequestParam String chatId) {
        try {
            ChatRoom chat = null;
            if (chatId != null) {
                chat = chatRoomRepository.findChatRoomByChatId(chatId);
            }
            return ResponseEntity.ok().body(chat);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Функция принимает запросы о поиске всех сообщений между двумя пользователями.
     */
    @GetMapping("/all/messages")
    public ResponseEntity<?> getMessages(
            @RequestParam String senderUsername, @RequestParam String recipientUsername
    ) {
        try {
            String chatId = chatMessageService.chatIdGenerateByTwoUser(senderUsername, recipientUsername);
            var messages = chatMessageService.findMessages(chatId);
            return ResponseEntity.ok().body(messages);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Функция принимает запросы о поиске всех сообщений между двумя пользователями.
     */
    @GetMapping("all/chatRoom/messages")
    public ResponseEntity<?> getChatMessages(
            @RequestParam String chatId
    ) {
        try {
            var messages = chatMessageService.findMessages(chatId);
            return ResponseEntity.ok().body(messages);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Функция принимает запросы о поиске непрочитанных сообщений для пользователя.
     */
    @GetMapping("/unread/messages")
    public ResponseEntity<?> getUnreadMessages(
            @RequestParam Long recipientId
    ) {
        try {
            var messages = chatMessageService.findUnreadMessages(recipientId);
            return ResponseEntity.ok().body(messages);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Функция принимает запросы на обновления статуса сообщений на READ (то есть сообщения были прочитаны)
     */
    @PostMapping("/update/messages")
    public ResponseEntity<?> updateMessages(
            @Valid @RequestBody MessagesRequest request
    ) {
        try {
            chatMessageService.updateUnreadMessages(request.getMessages());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Функция принимает запросы об удалении сообщения.
     */
    @PostMapping("/delete")
    public ResponseEntity<?> deleteMessages(
            @Valid @RequestBody ChatMessageDeletionRequest request
    ) {
        try {
            chatMessageService.deleteMessage(request.getMessage());

            String chatId = chatMessageService.chatIdGenerateByTwoUser(request.getMessage().getSenderName(), request.getMessage().getRecipientName());
            // Если между пользователями не осталось сообщений, то необходимо их удалить из списка контактов друг друга.
            if (chatMessageService.findMessages(chatId).isEmpty()) {
                contactsService.deleteUsersFromEachOthersContacts(request.getMessage().getSenderName(), request.getMessage().getRecipientName());
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Функция принимает запросы об удалении сообщения с предварительным поиском нужного сообщения по времени отправления и chatId.
     */
    @PostMapping("/delete/by/time/chatid")
    public ResponseEntity<?> deleteMsgByTimeAndChatId(@Valid @RequestBody EntityByTimeChatIdRequest request) {
        try {
            chatMessageService.deleteMsgByTimeAndChatId(request.getTime(), request.getSenderName(), request.getRecipientName());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("find/messages")
    public ResponseEntity<?> getMessagesByKeywords(
            @RequestParam String senderUsername,
            @RequestParam String recipientUsername,
            @RequestParam String keywordsString
    ) {
        try {
            var foundMessages = chatMessageService.findMessagesByKeywords(senderUsername, recipientUsername, keywordsString);
            return ResponseEntity.ok().body(foundMessages);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Функция принимает запросы на скачивание файла из мессенджера. Производится поиск нужного сообщения по времени
     * отправления и chatId, к которому был прикреплен этот файл.
     */
    @GetMapping("download/by/send/date/{time}/{senderName}/{recipientName}/{fileName}")
    public ResponseEntity<?> downloadFileBySendDateMsg(
            @PathVariable String time, @PathVariable String senderName,
            @PathVariable String recipientName, @PathVariable String fileName) {
        try {
            var sendDate = LocalDateTime.parse(time);
            var msg = chatMessageService.getMsgByTimeAndChatId(sendDate, senderName, recipientName);
            var fileObjects = msg.getAttachments();
            for (var fileObject : fileObjects) {
                if (Objects.equals(fileObject.getInitialName(), fileName)) {
                    byte[] fileContent = fileService.extractFile(fileObject);
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileObject.getInitialName() + "\"")
                            .header(HttpHeaders.CONTENT_TYPE, "application/octet-stream")
                            .body(fileContent);
                }
            }
            return ResponseEntity.badRequest().body(new MessageResponse("Ошибка при скачивании файла"));
        } catch (AuthorizationServiceException ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Нет прав доступа к этому контенту"));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Ошибка при скачивании файла"));
        }
    }

}
