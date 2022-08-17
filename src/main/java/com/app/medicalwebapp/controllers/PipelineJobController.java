package com.app.medicalwebapp.controllers;

import com.app.medicalwebapp.controllers.requestbody.MessageResponse;
import com.app.medicalwebapp.controllers.requestbody.PipelineJobCreationRequest;
import com.app.medicalwebapp.exceptions.ObjectNotExistsException;
import com.app.medicalwebapp.model.FileObject;
import com.app.medicalwebapp.model.Pipeline;
import com.app.medicalwebapp.model.PipelineJob;
import com.app.medicalwebapp.model.User;
import com.app.medicalwebapp.repositories.FileObjectRepository;
import com.app.medicalwebapp.repositories.PipelineJobRepository;
import com.app.medicalwebapp.repositories.PipelineRepository;
import com.app.medicalwebapp.security.AuthorizedWithUsername;
import com.app.medicalwebapp.security.UserDetailsImpl;
import com.app.medicalwebapp.services.PipelineExecutor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 604800)
@RestController
@RequestMapping("/api/pipelinejobs")
public class PipelineJobController {
    private final PipelineJobRepository pipelineJobRepository;
    private final FileObjectRepository fileObjectRepository;
    private final PipelineRepository pipelineRepository;
    private final PipelineExecutor pipelineExecutor;

    @Autowired
    public PipelineJobController(PipelineJobRepository pipelineJobRepository, FileObjectRepository fileObjectRepository, PipelineRepository pipelineRepository, PipelineExecutor pipelineExecutor) {
        this.pipelineJobRepository = pipelineJobRepository;
        this.fileObjectRepository = fileObjectRepository;
        this.pipelineRepository = pipelineRepository;
        this.pipelineExecutor = pipelineExecutor;
    }

    @GetMapping("{username}")
    @AuthorizedWithUsername
    public ResponseEntity<?> getPipelineJobsForUser(@PathVariable String username) {
        User creator = new User();
        creator.setId(getAuthenticatedUserId());
        List<PipelineJob> pipelineJobs = pipelineJobRepository.findByCreator(creator);
        return ResponseEntity.ok().body(pipelineJobs);
    }

    @PostMapping("{username}")
    @AuthorizedWithUsername
    public ResponseEntity<?> createPipelineJobForUser(@PathVariable String username, @RequestBody PipelineJobCreationRequest request) {
        try {
            FileObject fileObject = fileObjectRepository.findById(request.getFileId()).orElseThrow(ObjectNotExistsException::new);
            Pipeline pipeline = pipelineRepository.findById(request.getPipelineId()).orElseThrow(ObjectNotExistsException::new);
            pipelineExecutor.executePipeline(fileObject, pipeline, getAuthenticatedUserId());
        } catch (ObjectNotExistsException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("No pipeline or file found for requested ids"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error while starting pipeline"));
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("{username}/{pipelineJobId}/{fileId}")
    @AuthorizedWithUsername
    public ResponseEntity<?> deletePipelineJob(@PathVariable String username, @PathVariable Long pipelineJobId, @PathVariable Long fileId) {
        pipelineJobRepository.deleteById(pipelineJobId);
        fileObjectRepository.deleteById(fileId);
        return ResponseEntity.ok().build();
    }

    private Long getAuthenticatedUserId() {
        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return principal != null ? principal.getId() : null;
    }
}
