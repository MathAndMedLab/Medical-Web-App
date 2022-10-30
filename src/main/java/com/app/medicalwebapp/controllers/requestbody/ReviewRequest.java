package com.app.medicalwebapp.controllers.requestbody;

import lombok.Getter;
import lombok.ToString;

import javax.validation.constraints.NotNull;

@Getter
@ToString
public class ReviewRequest {

    @NotNull
    String content;

    long parent;

    long targetId;

    long rating;
}
