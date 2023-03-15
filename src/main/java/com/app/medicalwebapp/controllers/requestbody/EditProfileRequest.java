package com.app.medicalwebapp.controllers.requestbody;

import lombok.Data;
import lombok.ToString;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@ToString
public class EditProfileRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    private String firstname;

    private String lastname;

    private String patronymic;

    private String initials;

    // Only for doctors.
    private String specialization;

    private int experience;

    private String workplace;

    private String education;

    private int price;
}
