package com.app.medicalwebapp.controllers;

import com.app.medicalwebapp.controllers.requestbody.TopicRequest;
import com.app.medicalwebapp.controllers.requestbody.TopicResponse;
import com.app.medicalwebapp.model.Topic;
import com.app.medicalwebapp.repositories.TopicRepository;
import com.app.medicalwebapp.security.UserDetailsImpl;
import com.app.medicalwebapp.services.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;


@CrossOrigin(origins = "*", maxAge = 604800)
@RestController
@RequestMapping("/api/topics")
public class TopicController {
    private final TopicRepository topicRepository;
    private final TopicService topicService;

    @Autowired
    public TopicController(TopicRepository topicRepository, TopicService topicService) {
        this.topicRepository = topicRepository;
        this.topicService = topicService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllTopics() {
        try {
            List<Topic> topics = topicRepository.findAll();
            TopicResponse responseBody = TopicResponse.builder()
                    .topics(topics)
                    .build();
            return ResponseEntity.ok().body(responseBody);

        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createNewTopic(@Valid @RequestBody TopicRequest request) {
        try {
            topicService.createNewTopic(request, getAuthenticatedUserId());
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
