package com.app.medicalwebapp.services;

import com.app.medicalwebapp.clients.mirf.MirfOrchestratorClient;
import com.app.medicalwebapp.clients.mirf.MirfRepositoryClient;
import com.app.medicalwebapp.model.FileObject;
import com.app.medicalwebapp.model.FileObjectFormat;
import com.app.medicalwebapp.model.Pipeline;
import com.app.medicalwebapp.model.PipelineJob;
import com.app.medicalwebapp.model.PipelineJobStatus;
import com.app.medicalwebapp.model.User;
import com.app.medicalwebapp.repositories.PipelineJobRepository;
import com.app.medicalwebapp.utils.extracting.FileExtractorStrategy;
import com.app.medicalwebapp.utils.extracting.FileExtractorStrategyResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
public class PipelineExecutor {
    private final FileExtractorStrategyResolver extractorStrategyResolver;
    private final MirfOrchestratorClient mirfOrchestrator;
    private final MirfRepositoryClient mirfRepository;
    private final PipelineJobRepository pipelineJobRepository;

    @Autowired
    public PipelineExecutor(FileExtractorStrategyResolver extractorStrategyResolver, MirfOrchestratorClient mirfOrchestrator, MirfRepositoryClient mirfRepository, PipelineJobRepository pipelineJobRepository) {
        this.extractorStrategyResolver = extractorStrategyResolver;
        this.mirfOrchestrator = mirfOrchestrator;
        this.mirfRepository = mirfRepository;
        this.pipelineJobRepository = pipelineJobRepository;
    }

    public void triggerPipeline() throws Exception {
        InputStream inputStream = PipelineExecutor.class.getClassLoader().getResourceAsStream("image-000002.dcm");

        FileObject fileObject = new FileObject();
        fileObject.setPathToFile("tempFilePath");
        fileObject.setFormat(FileObjectFormat.DICOM);
        //processPipeline(fileObject, null, inputStream);
    }

    public void executePipeline(FileObject fileObject, Pipeline pipeline, Long creatorId) throws Exception {
        PipelineJob pipelineJob = initPipelineJob(fileObject, pipeline, creatorId);

        String sessionId = "";
        try {
            sessionId = mirfOrchestrator.getSessionId();
            pipelineJob.setMirfSessionid(sessionId);

            FileExtractorStrategy extractorStrategy = extractorStrategyResolver.getFileExtractor(fileObject.getFormat());
            byte[] fileInBytes = extractorStrategy.getFileInActualFormat(fileObject);
            Object inputInMirfPipeline = resolveMirfInput(fileObject.getFormat(), sessionId);
            byte[] zipArchive = MirfZipUtils.createZipArchive(inputInMirfPipeline, fileInBytes, sessionId);
            String zipArchiveName = sessionId + ".zip";

            mirfRepository.sendArchive(sessionId, zipArchiveName, zipArchive);
            pipelineJob.setStartedTime(LocalDateTime.now());
            pipelineJobRepository.save(pipelineJob);
            mirfOrchestrator.processPipeline(sessionId, pipeline.getJsonConfig());
            System.out.println("In try Pipeline Executor");
        } catch (Exception ex) {
            ex.printStackTrace();
            pipelineJob.setExecutionStatus(PipelineJobStatus.COMPLETED_ERROR);
            pipelineJobRepository.save(pipelineJob);
            System.out.println("In catch Pipeline Executor");
            throw ex;
        }
    }

    private PipelineJob initPipelineJob(FileObject fileObject, Pipeline pipeline, Long creatorId) {
        PipelineJob pipelineJob = new PipelineJob();
        pipelineJob.setPipeline(pipeline);
        User creator = new User();
        creator.setId(creatorId);
        pipelineJob.setCreator(creator);
        pipelineJob.setInputFiles(Collections.singletonList(fileObject));
        pipelineJob.setExecutionStatus(PipelineJobStatus.IN_PROGRESS);

        return pipelineJob;
    }

    private Object resolveMirfInput(FileObjectFormat fileFormat, String sessionId) {
        if (fileFormat == FileObjectFormat.DICOM) {
            return createMirfDicomReaderRequest(sessionId);
        }
        return null;
    }

    private List<String> createMirfDicomReaderRequest(String sessionId) {
        Path pathForBlock = Paths.get(sessionId, sessionId);
         List<String> requestToReadFiles = Collections.singletonList(pathForBlock.toString());
        return requestToReadFiles;
    }

}
