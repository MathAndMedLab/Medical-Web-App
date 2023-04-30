package com.app.medicalwebapp.controllers.requestbody;

import lombok.Getter;
import lombok.ToString;
import java.util.List;

import javax.validation.constraints.NotNull;

@Getter
@ToString
public class NotificationRequest {

    @NotNull
    private String data;

    @NotNull
    private String notificationType;

    private String notificationLink;

    @NotNull
    private List<Long> userIds;
}
