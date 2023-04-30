package com.app.medicalwebapp.controllers.requestbody;

import com.app.medicalwebapp.model.Notification;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class NotificationResponse {

    List<Notification> notifications;

}
