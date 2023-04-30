package com.app.medicalwebapp.controllers.requestbody;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String realName;
    private String mobilePhone;
    private int rate;
    private int status;
    private String initials;
    //private String chosenRole;
    private List<String> roles;
    private LocalDateTime registeredDate;
    private List<Long> notificationIds;

    public JwtResponse(String accessToken, Long id, String username,
                       List<String> roles, int rate, int status, LocalDateTime registeredDate, List<Long> notificationIds, String initials) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.roles = roles;
        this.initials = initials;
//        this.mobilePhone = mobilePhone;
        this.rate = rate;
        this.status = status;
        this.registeredDate = registeredDate;
        this.notificationIds = notificationIds;
    }
}