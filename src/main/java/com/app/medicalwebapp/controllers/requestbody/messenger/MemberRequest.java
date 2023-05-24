package com.app.medicalwebapp.controllers.requestbody.messenger;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MemberRequest {

    private Long userId;

    private String memberName;

}
