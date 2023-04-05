package com.app.medicalwebapp.controllers.requestbody;

import lombok.Data;
import lombok.ToString;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@ToString
public class SignUpRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    private String firstname;

    private String lastname;

    private String patronymic;

    private String initials;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    @Size(max = 10)
    private String chosenRole;

    // Only for doctors.
    private String specialization;

    private String specializedDiagnoses;

    private int experience;

    private String workplace;

    private String education;

    private int price;
}
