package com.app.medicalwebapp.utils.saving;

import com.app.medicalwebapp.clients.sftp.SftpClient;
import com.app.medicalwebapp.model.FileObject;
import com.app.medicalwebapp.model.FileObjectFormat;
import com.app.medicalwebapp.repositories.FileObjectRepository;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Component
public class SftpSaverStrategy implements FileSaverStrategy {
    private final SftpClient sftpClient;
    private final FileObjectRepository fileObjectRepository;

    private final Set<FileObjectFormat> SUPPORTED_FORMATS = Set.of(FileObjectFormat.PDF, FileObjectFormat.JPEG, FileObjectFormat.PNG);

    @Autowired
    public SftpSaverStrategy(SftpClient sftpClient, FileObjectRepository fileObjectRepository) {
        this.sftpClient = sftpClient;
        this.fileObjectRepository = fileObjectRepository;
    }

    @Override
    public boolean supportsFormat(FileObjectFormat fileFormat) {
        return SUPPORTED_FORMATS.contains(fileFormat);
    }

    /**
     * Сохранение файлов в sftp.
     */
    @Override
    public FileObject save(Long ownerId, String initialName, FileObjectFormat format, byte[] fileToSave, String UID) throws SftpException, JSchException {
        String uniqueID = UUID.randomUUID().toString();
        String pathToFile = "/upload/" + uniqueID;
        sftpClient.saveFile(fileToSave, pathToFile);
        FileObject fileObject = new FileObject();
        fileObject.setOwner(ownerId);
        fileObject.setPathToFile(pathToFile);
        fileObject.setFormat(format);
        fileObject.setInitialName(initialName);
        fileObject.setCreationTime(LocalDateTime.now());
        fileObject.setDeleted(false);
        fileObjectRepository.save(fileObject);
        return fileObject;
    }
}
