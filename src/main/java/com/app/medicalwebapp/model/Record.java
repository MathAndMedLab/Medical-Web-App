package com.app.medicalwebapp.model;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="records")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="id")
    private Long id;

    @Column(name="parent")
    private Long parent;

    @Column(name="title", length = 100)
    private String title;

    @Column(name="content")
    private String content;

    @ManyToOne
    @JoinColumn(name="creator", nullable=false)
    private User creator;

    @Column(name="num_replies")
    private int numberOfReplies;

    @Column(name="creation_time")
    private LocalDateTime creationTime;

    @Column(name="timeZone")
    private String timeZone;

    @Column(name="edited")
    private Boolean edited;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "record_to_topic",
            joinColumns = { @JoinColumn(name = "record_id") },
            inverseJoinColumns = { @JoinColumn(name = "topic_id") }
    )
    Set<Topic> topics = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER
//                cascade = { CascadeType.PERSIST, CascadeType.DETACH,
//                        CascadeType.MERGE, CascadeType.REFRESH}
    )
    @JoinTable(
            name = "record_to_file",
            joinColumns = { @JoinColumn(name = "record_id") },
            inverseJoinColumns = { @JoinColumn(name = "file_id") }
    )
    Set<FileObject> attachments = new HashSet<>();
}
