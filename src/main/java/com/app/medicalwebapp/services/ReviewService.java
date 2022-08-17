package com.app.medicalwebapp.services;

import com.app.medicalwebapp.controllers.requestbody.ReviewRequest;
import com.app.medicalwebapp.model.Review;
import com.app.medicalwebapp.model.User;
import com.app.medicalwebapp.repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }


    public List<Review> getReviewsByTarget(long parent, long targetId) {
        User target = new User();
        target.setId(targetId);
        return reviewRepository.findByParentAndTargetOrderByCreationTimeDesc(parent, target);
    }

    public void saveReview(ReviewRequest request, long creatorId) throws Exception  {
        User creator = new User();
        creator.setId(creatorId);
        User target = new User();
        target.setId(request.getTargetId());
        var timeZoneUnparsed = ZonedDateTime.now().toString();
        String timeZone = timeZoneUnparsed.substring(timeZoneUnparsed.lastIndexOf("[") + 1).split("]")[0];
        Review review = Review.builder()
                .content(request.getContent())
                .creationTime(LocalDateTime.now())
                .timeZone(timeZone)
                .creator(creator)
                .target(target)
                .parent(request.getParent())
                .build();
        reviewRepository.save(review);
    }

}
