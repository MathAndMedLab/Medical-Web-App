package com.app.medicalwebapp.model.messenger_models;

import com.app.medicalwebapp.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "chatroom")
@Data
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

    @Column(name = "avatar")
    private byte[] avatar;

    @ElementCollection(fetch = FetchType.EAGER)
    @Column(name = "members")
    private List<Long> members;
}
