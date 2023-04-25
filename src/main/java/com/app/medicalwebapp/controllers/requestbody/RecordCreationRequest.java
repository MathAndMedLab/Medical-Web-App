package com.app.medicalwebapp.controllers.requestbody;

import lombok.Getter;
import lombok.ToString;

import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@ToString
public class RecordCreationRequest {

    String title;

    @NotNull
    String content;

    Long parentId;

    List<Long> topics;

    List<Long> files;

    List<RecordFileRequest> newFiles;
    
}
