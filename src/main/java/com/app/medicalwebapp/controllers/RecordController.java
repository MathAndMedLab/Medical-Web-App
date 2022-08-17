package com.app.medicalwebapp.controllers;

import com.app.medicalwebapp.controllers.requestbody.RecordCreationRequest;
import com.app.medicalwebapp.controllers.requestbody.RecordsPageResponse;
import com.app.medicalwebapp.security.UserDetailsImpl;
import com.app.medicalwebapp.services.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Objects;

@CrossOrigin(origins = "*", maxAge = 604800)
@RestController
@RequestMapping("/api/records")
public class RecordController {
    private final RecordService recordService;

    @Autowired
    public RecordController(RecordService recordService) {
        this.recordService = recordService;
    }

    @GetMapping("/all/root")
    public ResponseEntity<?> getAllRootRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(name = "searchTitle", required = false) String searchTitle,
            @RequestParam(name = "selectedTopicValue", required = false, defaultValue = "") String selectedTopicValue
    ) {
        try {
            RecordsPageResponse responseBody;
            if (Objects.equals(selectedTopicValue, "")) {
                responseBody = recordService.getRecordsPage(page, pageSize, searchTitle);
            } else {
                responseBody = recordService.getRecordsPageByTopicAndTitle(page, pageSize, searchTitle, selectedTopicValue);
            }
            return ResponseEntity.ok().body(responseBody);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/{recordId}")
    public ResponseEntity<?> getRecord(@PathVariable Long recordId) {
        try {
            return ResponseEntity.ok().body(recordService.getRecordById(recordId));
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/answers/{recordId}")
    public ResponseEntity<?> getAllRecords(@PathVariable Long recordId) {
        try {
            return ResponseEntity.ok().body(recordService.getRecordsAnswers(recordId));
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> saveRecord(@Valid @RequestBody RecordCreationRequest request) {
        try {
            recordService.saveRecord(request, getAuthenticatedUserId(), request.getParentId());
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{recordId}")
    public ResponseEntity<?> deleteRecord(@PathVariable Long recordId) {
        try {
            recordService.delete(recordId);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return ResponseEntity.ok().build();
    }


    private Long getAuthenticatedUserId() {
        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return principal != null ? principal.getId() : null;
    }

}
