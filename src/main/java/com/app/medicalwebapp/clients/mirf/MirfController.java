package com.app.medicalwebapp.clients.mirf;

import com.app.medicalwebapp.model.FileObject;
import com.app.medicalwebapp.model.PipelineJob;
import com.app.medicalwebapp.model.PipelineJobStatus;
import com.app.medicalwebapp.repositories.PipelineJobRepository;
import com.app.medicalwebapp.services.FileService;
import com.app.medicalwebapp.services.service_utils.MirfZipUtils;
import com.app.medicalwebapp.services.PipelineExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/mirf")
public class MirfController {

    Logger log = LoggerFactory.getLogger(MirfController.class);

    @Autowired
    PipelineExecutor pipelineExecutor;

    @Autowired
    FileService fileService;

    @Autowired
    PipelineJobRepository pipelineJobRepository;


    @GetMapping("triggerPipeline")
    public void triggerPipeline() throws Exception {
        pipelineExecutor.triggerPipeline();
    }

    @PostMapping("mirfSuccess")
    public void getResultFromPipeline(@RequestParam("sessionId") String sessionId,
                                      @RequestParam("file") MultipartFile resultZipFile) throws IOException, ClassNotFoundException {
        InputStream zipInputStream = resultZipFile.getInputStream();
        byte[] zipInBytes = zipInputStream.readAllBytes();
        log.info("Received result from MIRF for session: {}, resultSize: {}", sessionId, resultZipFile.getSize());

        pipelineJobRepository.findAll().forEach(it -> System.out.println(it.getMirfSessionid()));
        PipelineJob relatedPipelineJob = pipelineJobRepository.findByMirfSessionid(sessionId).get(0);
        try {
            byte[] resultFileInBytes = MirfZipUtils.unzipResultArchive(zipInBytes);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("-dd-MM-yyyy-HH-mm-ss");
            String startedTime = formatter.format(relatedPipelineJob.getStartedTime());
            FileObject outputFile = fileService.saveFile("pipeline-result" + startedTime + ".pdf", resultFileInBytes, relatedPipelineJob.getCreator().getId(), "");
            relatedPipelineJob.setOutputFile(outputFile);
            relatedPipelineJob.setEndTime(LocalDateTime.now());
            relatedPipelineJob.setExecutionStatus(PipelineJobStatus.COMPLETED_OK);
        } catch (Exception ex) {
            relatedPipelineJob.setExecutionStatus(PipelineJobStatus.COMPLETED_ERROR);
            log.info("Unable to save result from MIRF, sessionId: {}, reason:{}", sessionId, ex.getMessage());
        }

        pipelineJobRepository.save(relatedPipelineJob);
    }

    @PostMapping("mirfError")
    public void getErrorFromPipeline(@RequestParam("sessionId") String sessionId,
                                     @RequestParam("reason") String failReason) {
        log.info("Received error from MIRF for session: {}, reason: {}", sessionId, failReason);

        PipelineJob relatedPipelineJob = pipelineJobRepository.findByMirfSessionid(sessionId).get(0);
        relatedPipelineJob.setExecutionStatus(PipelineJobStatus.COMPLETED_ERROR);
        pipelineJobRepository.save(relatedPipelineJob);
    }
}
