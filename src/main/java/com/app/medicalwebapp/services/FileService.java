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
    private final FileSaverStrategyResolver saverStrategyResolver;
    private final FileExtractorStrategyResolver extractorStrategyResolver;
    private final FileObjectRepository fileObjectRepository;

    @Autowired
    public FileService(FileSaverStrategyResolver saverStrategyResolver, FileExtractorStrategyResolver extractorStrategyResolver, FileObjectRepository fileObjectRepository) {
        this.saverStrategyResolver = saverStrategyResolver;
        this.extractorStrategyResolver = extractorStrategyResolver;
        this.fileObjectRepository = fileObjectRepository;
    }

    /**
     * Сохранение файла.
     */
    public FileObject saveFile(String originalName, byte[] fileContent, Long ownerId, String UID) throws Exception {
        FileSaverStrategy fileSaver = saverStrategyResolver.getFileSaver(originalName); // Выбрать способ сохранения файла, зависит от его расширения.
        FileObjectFormat format = FileFormatResolver.resolveFormat(originalName);
        return fileSaver.save(ownerId, originalName, format, fileContent, UID);
    }

    /**
     * Скачивание файла.
     */
    public byte[] extractFile(FileObject fileObject) throws Exception {
        FileExtractorStrategy fileExtractor = extractorStrategyResolver.getFileExtractor(fileObject.getFormat()); // Выбрать способ скачивания файла, зависит от его расширения.
        return fileExtractor.getFileInActualFormat(fileObject);
    }

    /**
     * Отображение файла.
     */
    public byte[] previewFile(FileObject fileObject) throws Exception {
        FileExtractorStrategy fileExtractor = extractorStrategyResolver.getFileExtractor(fileObject.getFormat()); // Выбрать способ отображения файла, зависит от его расширения.
        return fileExtractor.getHumanReadablePresentation(fileObject);
    }

    /**
     * Удаление файла.
     */
    public boolean deleteFile(Long fileId) {
        var fileToDelete = fileObjectRepository.findById(fileId).orElse(null);
        if (fileToDelete == null) return false;

        fileToDelete.setDeleted(true); // Файлы удаляются "лениво", всегда остаются в БД.
        fileObjectRepository.save(fileToDelete);
        return true;
    }

    /**
     * Редактирование названия файла.
     */
    public FileObject editFile(String newName, Long fileId) throws Exception{
        if (newName == null) throw new IllegalArgumentException();
        var file = fileObjectRepository.findById(fileId).orElse(null);
        if (file == null) return null;

        file.setInitialName(newName);
        fileObjectRepository.save(file);
        return file;
    }
}
