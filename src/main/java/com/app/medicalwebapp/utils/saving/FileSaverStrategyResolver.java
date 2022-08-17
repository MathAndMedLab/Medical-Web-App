package com.app.medicalwebapp.utils.saving;

import com.app.medicalwebapp.model.FileObjectFormat;
import com.app.medicalwebapp.utils.FileFormatResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FileSaverStrategyResolver {
    private final List<FileSaverStrategy> strategies;
    private final SftpSaverStrategy sftpSaverStrategy;

    @Autowired
    public FileSaverStrategyResolver(List<FileSaverStrategy> strategies, SftpSaverStrategy sftpSaverStrategy) {
        this.strategies = strategies;
        this.sftpSaverStrategy = sftpSaverStrategy;
    }

    /**
     * Определение способа сохранения файла, в orthanc или в sftp, зависит от формата файла.
     * Возвращает класс PacsSaverStrategy (для .dcm файлов) или SftpSaverStrategy (для остальных файлов).
     */
    public FileSaverStrategy getFileSaver(String fileName) {
        FileObjectFormat fileFormat = FileFormatResolver.resolveFormat(fileName);
        return strategies.stream()
                .filter(strategy -> strategy.supportsFormat(fileFormat))
                .findFirst()
                .orElse(sftpSaverStrategy);
    }
}
