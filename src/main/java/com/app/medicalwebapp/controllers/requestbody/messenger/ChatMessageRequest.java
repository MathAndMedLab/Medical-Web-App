package com.app.medicalwebapp.controllers.requestbody.messenger;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ChatMessageRequest {
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
