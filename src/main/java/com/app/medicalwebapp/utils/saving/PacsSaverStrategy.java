package com.app.medicalwebapp.utils.saving;

import com.app.medicalwebapp.clients.pacs.OrthancInstancesClient;
import com.app.medicalwebapp.model.FileObject;
import com.app.medicalwebapp.model.FileObjectFormat;
import com.app.medicalwebapp.services.FileObjectService;
import com.app.medicalwebapp.services.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class PacsSaverStrategy implements FileSaverStrategy {

    @Autowired
    OrthancInstancesClient orthancClient;

    @Autowired
    RecordService recordService;

    @Autowired
    FileObjectService fileObjectService;

    @Override
    public boolean supportsFormat(FileObjectFormat fileFormat) {
        return fileFormat == FileObjectFormat.DICOM;
    }

    @Override
    public FileObject save(Long ownerId, String initialName, FileObjectFormat format, byte[] fileToSave, String UID) throws Exception {
        FileObject fileObject = new FileObject();
        fileObject.setOwner(ownerId);
        String idPathInPacs = orthancClient.uploadInstance(fileToSave);
        fileObject.setPathToFile(idPathInPacs);
        fileObject.setFormat(format);
        fileObject.setInitialName(initialName);
        fileObject.setCreationTime(LocalDateTime.now());
        fileObject.setUID(UID);
        fileObject.setDeleted(false);
        fileObjectService.saveFileObject(fileObject);
        return fileObject;
    }
}
