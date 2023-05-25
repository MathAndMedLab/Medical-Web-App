package com.app.medicalwebapp.model.messenger_models;

import com.app.medicalwebapp.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "chatrooms")
@Data
@DynamicUpdate
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Builder.Default
    @Column(name = "chatId")
    private String chatId = UUID.randomUUID().toString();

    @Column(name = "chatName")
    private String chatName;

    @Column(name = "creatorName")
    private String creatorName;

    @Column(name = "creatorId")
    private Long creatorId;

    @Column(name = "avatar")
    private byte[] avatar;

    @ManyToMany
    @JoinTable(
            name = "chatrooms_users",
            joinColumns = @JoinColumn(name = "chatroom_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members;

}
