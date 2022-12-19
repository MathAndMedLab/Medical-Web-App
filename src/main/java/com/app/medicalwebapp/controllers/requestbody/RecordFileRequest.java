package com.app.medicalwebapp.controllers.requestbody;

import lombok.Getter;

@Getter
public class RecordFileRequest {
    private String fileContent;
    private String fileName;
    private String uid;
}
