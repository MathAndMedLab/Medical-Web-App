package com.app.medicalwebapp.utils.extracting;

import com.app.medicalwebapp.clients.sftp.SftpClient;
import com.app.medicalwebapp.model.FileObject;
import com.app.medicalwebapp.model.FileObjectFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class SftpExtractorStrategy implements FileExtractorStrategy {
    private final SftpClient sftpClient;

    private final Set<FileObjectFormat> SUPPORTED_FORMATS = Set.of(FileObjectFormat.PDF, FileObjectFormat.JPEG, FileObjectFormat.PNG);

    @Autowired
    public SftpExtractorStrategy(SftpClient sftpClient) {
        this.sftpClient = sftpClient;
    }

    @Override
    public boolean supportsFormat(FileObjectFormat fileFormat) {
        return SUPPORTED_FORMATS.contains(fileFormat);
    }

    /**
     * Получение byte[] для скачивания файла.
     */
    @Override
    public byte[] getFileInActualFormat(FileObject fileObject) throws Exception {
        return sftpClient.getFile(fileObject.getPathToFile());
    }

    /**
     * Получение byte[] для отображения файла.
     */
    @Override
    public byte[] getHumanReadablePresentation(FileObject fileObject) throws Exception {
        if (fileObject.getFormat() == FileObjectFormat.JPEG || fileObject.getFormat() == FileObjectFormat.PNG) {
            return sftpClient.getFile(fileObject.getPathToFile());
        } else {
            throw new UnsupportedOperationException();
        }
    }
}
