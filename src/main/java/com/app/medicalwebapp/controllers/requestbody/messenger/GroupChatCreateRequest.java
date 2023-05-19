package com.app.medicalwebapp.controllers.requestbody.messenger;

import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class GroupChatCreateRequest {
    private String chatName;

    private List<MemberRequest> members;

    private String creator;

    private Long creatorId;

    private String avatar;

    private LocalDateTime sendDate;

    private String timeZone;

}
