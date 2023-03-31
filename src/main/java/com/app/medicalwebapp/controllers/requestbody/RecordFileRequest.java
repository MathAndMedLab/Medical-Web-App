package com.app.medicalwebapp.controllers.requestbody;

import lombok.Getter;

/**
 *  Класс предназначенный для новых загружаемых файлов при создании поста
 */
@Getter
public class RecordFileRequest {
    private String fileContent;
    private String fileName;
    private String uid;
}
