package com.app.medicalwebapp.controllers.requestbody.messenger;

import com.app.medicalwebapp.model.FileObjectFormat;
import lombok.Getter;

@Getter
public class ChatFileRequest {
    private String fileContent;
    private String fileName;
}
