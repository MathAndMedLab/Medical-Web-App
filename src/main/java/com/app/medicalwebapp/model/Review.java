package com.app.medicalwebapp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "content", length = 1500)
    private String content;

    @Column(name = "parent")
    private Long parent; //чтобы оставить комментарий к комментарию

    @Column(name = "creation_time")
    private LocalDateTime creationTime;

    @Column(name = "timeZone")
    private String timeZone;

    @ManyToOne
    @JoinColumn(name = "creator", nullable = false)
    private User creator;

    @ManyToOne
    @JoinColumn(name = "target"/*, nullable=false*/)
    private User target;

    @Column(name = "num_replies")
    private int numberOfReplies;

    @Column(name = "likes")
    private int likes;

    @Column(name = "dislikes")
    private int dislikes;
}
