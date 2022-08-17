package com.app.medicalwebapp.services.messenger_services;

import com.app.medicalwebapp.controllers.requestbody.messenger.ChatMessageRequest;
import com.app.medicalwebapp.model.messenger_models.ChatMessage;
import com.app.medicalwebapp.model.messenger_models.StatusMessage;
import com.app.medicalwebapp.repositories.messenger_repositories.ChatMessageRepository;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest
class ChatMessageServiceTest {

    @Autowired
    private ChatMessageService chatMessageService;

    @MockBean
    private ChatMessageRepository chatMessageRepository;

    @Test
    void save() {
        try {
            ChatMessageRequest chatMessageRequest = new ChatMessageRequest();
            chatMessageRequest.setContent("Привет. Это тест сохранения");
            chatMessageRequest.setSenderName("John");
            chatMessageRequest.setRecipientName("Doe");

            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setContent("Привет. Это тест сохранения");
            chatMessage.setSenderName("John");
            chatMessage.setRecipientName("Doe");
            chatMessage.setChatId("DoeJohn");
            chatMessage.setStatusMessage(StatusMessage.UNREAD);
            chatMessage.setAttachments(new ArrayList<>());
            Mockito.doReturn(chatMessage)
                    .when(chatMessageRepository)
                    .save(chatMessage);
            ChatMessage returnedChatMessage = chatMessageService.save(chatMessageRequest);
            Mockito.verify(chatMessageRepository, Mockito.times(1))
                    .save(chatMessage);
            assertEquals(chatMessage, returnedChatMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void findMessages() {
        try {
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setContent("Привет. Это тест поиска");
            chatMessage.setSenderName("John");
            chatMessage.setRecipientName("Doe");
            chatMessage.setChatId("DoeJohn");

            Mockito.doReturn(Optional.of(List.of(chatMessage)))
                    .when(chatMessageRepository)
                    .findByChatIdAndDeleted(chatMessage.getChatId(), false);
            List<ChatMessage> returnedChatMessage = chatMessageService.findMessages(chatMessage.getSenderName(), chatMessage.getRecipientName());
            Mockito.verify(chatMessageRepository, Mockito.times(1))
                    .findByChatIdAndDeleted(chatMessage.getChatId(), false);
            assertEquals(chatMessage, returnedChatMessage.get(0));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void findUnreadMessages() {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContent("Привет. Это тест поиска непрочитанных сообщений");
        chatMessage.setRecipientId(1L);

        Mockito.doReturn(Optional.of(List.of(chatMessage)))
                .when(chatMessageRepository)
                .findByRecipientIdAndStatusMessageAndDeleted(chatMessage.getRecipientId(), StatusMessage.UNREAD, false);
        List<ChatMessage> returnedChatMessage = chatMessageService.findUnreadMessages(1L);
        Mockito.verify(chatMessageRepository, Mockito.times(1))
                .findByRecipientIdAndStatusMessageAndDeleted(chatMessage.getRecipientId(), StatusMessage.UNREAD, false);
        assertEquals(chatMessage, returnedChatMessage.get(0));
    }

    @Test
    void updateUnreadMessages() {
        ChatMessage chatMessage1 = new ChatMessage();
        ChatMessage chatMessage2 = new ChatMessage();
        ChatMessage chatMessage3 = new ChatMessage();
        chatMessageService.updateUnreadMessages(List.of(chatMessage1, chatMessage2, chatMessage3));
        Mockito.verify(chatMessageRepository, Mockito.times(3))
                .save(chatMessage1);
    }

    @Test
    void deleteMessage() {
        ChatMessage chatMessage = new ChatMessage();
        try {
            chatMessageService.deleteMessage(chatMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Mockito.verify(chatMessageRepository, Mockito.times(1))
                .delete(chatMessage);
    }

    @Test
    void deleteMsgByTimeAndChatId() {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSendDate(LocalDateTime.now());
        chatMessage.setSenderName("John");
        chatMessage.setRecipientName("Doe");
        chatMessage.setChatId("DoeJohn");
        Mockito.doReturn(chatMessage)
                .when(chatMessageRepository)
                .findBySendDateAndChatId(chatMessage.getSendDate(), chatMessage.getChatId());
        chatMessageService.deleteMsgByTimeAndChatId(chatMessage.getSendDate(), chatMessage.getSenderName(), chatMessage.getRecipientName());
        Mockito.verify(chatMessageRepository, Mockito.times(1))
                .delete(chatMessage);
    }

    @Test
    void findFirstByChatIdOrderBySendDateDesc() {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setChatId("DoeJohn");
        Mockito.doReturn(Optional.of(chatMessage))
                .when(chatMessageRepository)
                .findFirstByChatIdAndDeleted_IsFalseOrderByIdDesc(chatMessage.getChatId());
        Optional<ChatMessage> returnedChatMessageOpt = chatMessageService.findFirstByChatIdOrderBySendDateDesc(chatMessage.getChatId());
        if (returnedChatMessageOpt.isPresent()) {
            ChatMessage returnedChatMessage = returnedChatMessageOpt.get();
            assertEquals(chatMessage, returnedChatMessage);
        }
    }
}