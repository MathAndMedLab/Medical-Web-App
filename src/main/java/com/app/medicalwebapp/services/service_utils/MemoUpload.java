package com.app.medicalwebapp.services.service_utils;

import com.app.medicalwebapp.model.FileObject;
import com.app.medicalwebapp.repositories.FileObjectRepository;
import com.app.medicalwebapp.services.FileService;

import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class MemoUpload {
    private final Map<Base64String, FileObject> memoizeCache = new HashMap<>();
    private final FileObjectRepository fileObjectRepository;
    private final FileService fileService;

    public MemoUpload(FileObjectRepository fileObjectRepository, FileService fileService) {
        this.fileObjectRepository = fileObjectRepository;
        this.fileService = fileService;
    }

    public FileObject checkMemo(Long ownerId, byte[] fileContent) {
        var savedFiles = fileObjectRepository.findByOwnerAndDeleted(ownerId, false);
        var base64String = new Base64String(Base64.getEncoder().encodeToString(fileContent));
        if (memoizeCache.containsKey(base64String)) {
            return memoizeCache.get(base64String);
        } else {
            var result = savedFiles.stream()
                .filter( x ->
                {
                    try {
                        if (memoizeCache.containsValue(x)) {
                            return false;
                        } else {
                            var newFileContent = fileService.previewFile(x);
                            var newFileContentString = new Base64String(Base64.getEncoder().encodeToString(newFileContent));
                            memoizeCache.put(newFileContentString, x);
                            return (Arrays.equals(fileContent, newFileContent));
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    return false;
                })
                .findFirst();
            return result.orElse(null);
        }
    }
}
