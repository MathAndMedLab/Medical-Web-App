package com.app.medicalwebapp.controllers.messenger_controllers;

import com.app.medicalwebapp.controllers.requestbody.MessageResponse;
import com.app.medicalwebapp.controllers.requestbody.messenger.ChatMessageDeletionRequest;
import com.app.medicalwebapp.controllers.requestbody.messenger.EntityByTimeChatIdRequest;
import com.app.medicalwebapp.controllers.requestbody.messenger.MessagesRequest;
import com.app.medicalwebapp.services.FileService;
import com.app.medicalwebapp.services.messenger_services.ChatMessageService;
import com.app.medicalwebapp.services.messenger_services.ContactsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.Objects;

@CrossOrigin(origins = "*", maxAge = 604800)
@RestController
@RequestMapping("/api/msg")
public class ChatControllerHTTP {
    private final ChatMessageService chatMessageService;
    private final ContactsService contactsService;
    private final FileService fileService;

    @Autowired
    public ChatControllerHTTP(ChatMessageService chatMessageService, ContactsService contactsService, FileService fileService) {
        this.chatMessageService = chatMessageService;
        this.contactsService = contactsService;
        this.fileService = fileService;
    }

    /**
     * Функция принимает запросы о поиске всех сообщений между двумя пользователями.
     */
    @GetMapping("/all/messages")
    public ResponseEntity<?> getMessages(
            @RequestParam String senderUsername, @RequestParam String recipientUsername
    ) {
        try {
            var messages = chatMessageService.findMessages(senderUsername, recipientUsername);
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

            // Если между пользователями не осталось сообщений, то необходимо их удалить из списка контактов друг друга.
            if (chatMessageService.findMessages(request.getMessage().getSenderName(), request.getMessage().getRecipientName()).isEmpty()) {
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
