package com.app.medicalwebapp.controllers.requestbody;

import com.app.medicalwebapp.model.User;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserResponse {

    List<User> users;

}
