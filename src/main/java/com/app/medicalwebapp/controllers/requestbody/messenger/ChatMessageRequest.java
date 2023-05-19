package com.app.medicalwebapp.controllers.requestbody.messenger;

import com.app.medicalwebapp.model.messenger_models.ChatMessage.MessageType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ChatMessageRequest {

    private String chatId;

    private MessageType type;

    private Long senderId;

    private Long recipientId;

    private String senderName;

    private String recipientName;

    private String content;

    private  List<ChatFileRequest> files;

    private LocalDateTime sendDate;

    private String timeZone;

    private String uid;

}
