package com.app.medicalwebapp.controllers.messenger_controllers;

import com.app.medicalwebapp.controllers.requestbody.messenger.ChatMessageRequest;
import com.app.medicalwebapp.services.messenger_services.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatControllerWS {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatMessageService chatMessageService;

    @Autowired
    public ChatControllerWS(SimpMessagingTemplate simpMessagingTemplate, ChatMessageService chatMessageService) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.chatMessageService = chatMessageService;
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