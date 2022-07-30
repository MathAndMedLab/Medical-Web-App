package com.app.medicalwebapp.services;

import com.app.medicalwebapp.model.FileObject;
import com.app.medicalwebapp.model.FileObjectFormat;
import com.app.medicalwebapp.repositories.FileObjectRepository;
import com.app.medicalwebapp.utils.FileFormatResolver;
import com.app.medicalwebapp.utils.extracting.FileExtractorStrategy;
import com.app.medicalwebapp.utils.extracting.FileExtractorStrategyResolver;
import com.app.medicalwebapp.utils.saving.FileSaverStrategy;
import com.app.medicalwebapp.utils.saving.FileSaverStrategyResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileService {

    @Autowired
    FileSaverStrategyResolver saverStrategyResolver;

    @Autowired
    FileExtractorStrategyResolver extractorStrategyResolver;

    @Autowired
    FileObjectRepository fileObjectRepository;

    public FileObject saveFile(String originalName, byte[] fileContent, Long ownerId, String UID) throws Exception {
        FileSaverStrategy fileSaver = saverStrategyResolver.getFileSaver(originalName, fileContent);
        FileObjectFormat format = FileFormatResolver.resolveFormat(originalName);
        return fileSaver.save(ownerId, originalName, format, fileContent, UID);
    }

    public byte[] extractFile(FileObject fileObject) throws Exception {
        FileExtractorStrategy fileExtractor = extractorStrategyResolver.getFileExtractor(fileObject.getFormat());
        return fileExtractor.getFileInActualFormat(fileObject);
    }

    public byte[] previewFile(FileObject fileObject) throws Exception {
        FileExtractorStrategy fileExtractor = extractorStrategyResolver.getFileExtractor(fileObject.getFormat());
        return fileExtractor.getHumanReadablePresentation(fileObject);
    }

    public boolean deleteFile(Long fileId) {
        var fileToDelete = fileObjectRepository.findById(fileId).orElse(null);
        if (fileToDelete == null) return false;

        fileToDelete.setDeleted(true);
        fileObjectRepository.save(fileToDelete);
        return true;
    }

    public FileObject editFile(String newName, Long fileId) throws Exception{
        if (newName == null) throw new IllegalArgumentException();
        var file = fileObjectRepository.findById(fileId).orElse(null);
        if (file == null) return null;

        file.setInitialName(newName);
        fileObjectRepository.save(file);
        return file;
    }
}
