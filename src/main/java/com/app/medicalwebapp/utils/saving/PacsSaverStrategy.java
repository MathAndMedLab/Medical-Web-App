package com.app.medicalwebapp.utils.saving;

import com.app.medicalwebapp.clients.pacs.OrthancInstancesClient;
import com.app.medicalwebapp.model.FileObject;
import com.app.medicalwebapp.model.FileObjectFormat;
import com.app.medicalwebapp.repositories.FileObjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class PacsSaverStrategy implements FileSaverStrategy {
    private final OrthancInstancesClient orthancClient;
    private final FileObjectRepository fileObjectRepository;

    @Autowired
    public PacsSaverStrategy(OrthancInstancesClient orthancClient, FileObjectRepository fileObjectRepository) {
        this.orthancClient = orthancClient;
        this.fileObjectRepository = fileObjectRepository;
    }

    @Override
    public boolean supportsFormat(FileObjectFormat fileFormat) {
        return fileFormat == FileObjectFormat.DICOM;
    }

    /**
     * Сохранение .dcm файлов в orthanc.
     */
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
        fileObjectRepository.save(fileObject);
        return fileObject;
    }
}
