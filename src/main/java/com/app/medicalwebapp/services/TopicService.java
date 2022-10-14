package com.app.medicalwebapp.services;

import com.app.medicalwebapp.controllers.requestbody.TopicRequest;
import com.app.medicalwebapp.model.Topic;
import org.springframework.stereotype.Service;
import com.app.medicalwebapp.repositories.TopicRepository;
import com.app.medicalwebapp.model.User;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;


@Service
public class TopicService {
    private final TopicRepository topicRepository;

    public TopicService(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }

    public void createNewTopic(TopicRequest request, Long creatorId) throws Exception {
        User creator = new User();
        creator.setId(creatorId);
        var timeZoneUnparsed = ZonedDateTime.now().toString();
        String timeZone = timeZoneUnparsed.substring(timeZoneUnparsed.lastIndexOf("[") + 1).split("]")[0];
        Topic topic = Topic.builder()
                .name(request.getTopicName())
                .creationTime(LocalDateTime.now())
                .timeZone(timeZone)
                .creator(creator)
                .build();
        topicRepository.save(topic);
    }
}
