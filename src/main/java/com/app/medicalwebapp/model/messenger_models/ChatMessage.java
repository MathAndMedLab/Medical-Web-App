package com.app.medicalwebapp.model.messenger_models;

import com.app.medicalwebapp.model.FileObject;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "chatmessages")
@Data
@DynamicUpdate
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "chatId")
    private String chatId;

    @Column(name = "senderId")
    private Long senderId;

    @Column(name = "recipientId")
    private Long recipientId;

    @Column(name = "senderName")
    private String senderName;

    @Column(name = "recipientName")
    private String recipientName;

    @Column(name = "content", length = 2000)
    private String content;

    @Column(name = "sendDate")
    private LocalDateTime sendDate;

    @Column(name = "timeZone")
    private String timeZone;

    @Column(name = "statusMessage")
    private StatusMessage statusMessage;

    @Column(name = "deleted")
    private boolean deleted;

    @ManyToMany
    @JoinTable(
            name = "files_msgs",
            joinColumns = @JoinColumn(name = "msg_id"),
            inverseJoinColumns = @JoinColumn(name = "file_id")
    )
    private List<FileObject> attachments;

    @ElementCollection
    private List<byte[]> images;

    @ElementCollection
    private List<String> uidFilesDicom;
}
