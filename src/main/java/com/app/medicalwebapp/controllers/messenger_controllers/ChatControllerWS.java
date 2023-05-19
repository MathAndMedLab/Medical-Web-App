package com.app.medicalwebapp.controllers.messenger_controllers;

import com.app.medicalwebapp.controllers.requestbody.messenger.ChatMessageRequest;
import com.app.medicalwebapp.model.messenger_models.ChatMessage;
import com.app.medicalwebapp.model.messenger_models.ChatRoom;
import com.app.medicalwebapp.repositories.UserRepository;
import com.app.medicalwebapp.repositories.messenger_repositories.ChatRoomRepository;
import com.app.medicalwebapp.services.messenger_services.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.awt.*;

@RestController
public class ChatControllerWS {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final UserRepository userRepository;
    private final ChatMessageService chatMessageService;
    private final ChatRoomRepository chatRoomRepository;

    @Autowired
    public ChatControllerWS(SimpMessagingTemplate simpMessagingTemplate, UserRepository userRepository, ChatMessageService chatMessageService, ChatRoomRepository chatRoomRepository) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.userRepository = userRepository;
        this.chatMessageService = chatMessageService;
        this.chatRoomRepository = chatRoomRepository;
    }

    @MessageMapping("/send/group-chat/{chatId}")
    public void sendMessageToAny(@DestinationVariable("chatId") String chatId, @RequestParam ChatMessageRequest msg) {
        try {
            var chatRoom = chatRoomRepository.findChatRoomByChatId(chatId);
            var chatMessage = chatMessageService.save(msg);
            sendMessageInGroup(chatRoom, chatMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendNotificationMessage(ChatMessage msg) {
        try {
            var chatRoom = chatRoomRepository.findChatRoomByChatId(msg.getChatId());
            sendMessageInGroup(chatRoom, msg);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void sendMessageInGroup(ChatRoom chat, ChatMessage msg) {
        for (Long member : chat.getMembers()) {
            if (!member.equals(msg.getSenderId())) {
                var user = userRepository.findById(member);
                try {
                    simpMessagingTemplate.convertAndSendToUser(user.get().getUsername(), "/private-group-chat", msg);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
    /**
     * Функция принимает запросы об отправлении сообщения адресату через websocket от клиента.
     */
    @MessageMapping("/send/{recipient}")
    public void sendMessage(@DestinationVariable("recipient") String recipient, @RequestParam ChatMessageRequest msg) {
        try {
            var chatMessage = chatMessageService.save(msg);
            // Отправление сообщения, сохраненного в БД, адресату.
            simpMessagingTemplate.convertAndSendToUser(recipient, "/private", chatMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}