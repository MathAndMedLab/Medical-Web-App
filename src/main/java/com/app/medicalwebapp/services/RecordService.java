package com.app.medicalwebapp.services;

import com.app.medicalwebapp.controllers.requestbody.RecordCreationRequest;
import com.app.medicalwebapp.controllers.requestbody.RecordsPageResponse;
import com.app.medicalwebapp.model.FileObject;
import com.app.medicalwebapp.model.Record;
import com.app.medicalwebapp.model.Topic;
import com.app.medicalwebapp.model.User;
import com.app.medicalwebapp.repositories.FileObjectRepository;
import com.app.medicalwebapp.repositories.RecordRepository;
import com.app.medicalwebapp.repositories.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class RecordService {
    private final RecordRepository recordRepository;
    private final TopicRepository topicRepository;
    private final FileObjectRepository fileObjectRepository;

    @Autowired
    public RecordService(RecordRepository recordRepository, TopicRepository topicRepository, FileObjectRepository fileObjectRepository) {
        this.recordRepository = recordRepository;
        this.topicRepository = topicRepository;
        this.fileObjectRepository = fileObjectRepository;
    }


    public RecordsPageResponse getRecordsPage(Integer pageNumber, Integer sizeOfPage, String partOfTitle) {
        Pageable pageable = PageRequest.of(pageNumber, sizeOfPage);

        Page<Record> recordsPage = partOfTitle != null
                ? recordRepository.findByParentAndTitleContainingIgnoreCaseOrderByCreationTimeDesc(-1L, partOfTitle, pageable)
                : recordRepository.findByParentOrderByCreationTimeDesc(-1L, pageable);

        return getRecordsResponse(recordsPage, pageNumber);
    }

    /*public RecordsPageResponse getRecordsPageByTopic(Integer pageNumber, Integer sizeOfPage, Long topicId) {
        Pageable pageable = PageRequest.of(pageNumber, sizeOfPage);
        Topic topic = new Topic();
        topic.setId(topicId);
        Page<Record> recordsPage = recordRepository.findByTopics(topic, pageable);

        return getRecordsResponse(recordsPage, pageNumber);
    }*/

    public RecordsPageResponse getRecordsPageByTopicAndTitle(Integer pageNumber, Integer sizeOfPage, String partOfTitle, String selectedTopicValue) {
        Pageable pageable = PageRequest.of(pageNumber, sizeOfPage);

        Topic topic = new Topic();
        topic = topicRepository.findByName(selectedTopicValue);
//        topic.setId(topicId);
        Page<Record> recordsPage = partOfTitle != null
                ? recordRepository.findByParentAndTopicsAndTitleContainingIgnoreCaseOrderByCreationTimeDesc(-1L, topic, partOfTitle, pageable)
                : recordRepository.findByParentAndTopicsOrderByCreationTimeDesc(-1L, topic, pageable);

        return getRecordsResponse(recordsPage, pageNumber);
    }

    public Record getRecordById(Long recordId) {
        return recordRepository.findById(recordId).orElse(null);
    }

    public List<Record> getRecordsAnswers(Long parentId) {
        return recordRepository.findByParentOrderByCreationTimeDesc(parentId);
    }

    public void saveRecord(RecordCreationRequest request, Long creatorId, Long parentId) throws Exception {
        if (!request.getParentId().equals(-1L)) {
            updateNumberOfReplies(request.getParentId());
        }

        Set<FileObject> files = null;
        if (request.getFiles() != null && !request.getFiles().isEmpty()) {
            files = request.getFiles().stream()
                    .map(fileId -> fileObjectRepository.findById(fileId).orElse(null))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());
        }

        Set<Topic> topics = null;
        if (request.getTopics() != null && !request.getTopics().isEmpty()) {
            topics = request.getTopics().stream().map(topicId -> {
                Topic topic = new Topic();
                topic.setId(topicId);
                return topic;
            }).collect(Collectors.toSet());
        }

        User creator = new User();
        creator.setId(creatorId);
        var timeZoneUnparsed = ZonedDateTime.now().toString();
        String timeZone = timeZoneUnparsed.substring(timeZoneUnparsed.lastIndexOf("[") + 1).split("]")[0];
        Record record = Record.builder()
                .content(request.getContent())
                .title(request.getTitle())
                .creationTime(LocalDateTime.now())
                .timeZone(timeZone)
                .creator(creator)
                .edited(false)
                .attachments(files)
                .topics(topics)
                .parent(parentId)
                .build();

        recordRepository.save(record);
    }

    public void delete(Long recordId) {
        recordRepository.deleteById(recordId);
    }

    private RecordsPageResponse getRecordsResponse(Page recordsPage, int pageNumber) {
        return RecordsPageResponse.builder()
                .records(recordsPage.getContent())
                .currentPage(pageNumber)
                .totalElements(recordsPage.getTotalElements())
                .totalPages(recordsPage.getTotalPages())
                .build();
    }

    private void updateNumberOfReplies(Long parentId) throws Exception {
        Record record = recordRepository.findById(parentId)
                .orElseThrow(() -> new Exception("No record with id: " + parentId));
        int currentNumber = record.getNumberOfReplies();
        record.setNumberOfReplies(currentNumber + 1);
    }
}
