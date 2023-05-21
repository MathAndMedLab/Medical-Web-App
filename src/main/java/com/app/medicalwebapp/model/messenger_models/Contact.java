package com.app.medicalwebapp.model.messenger_models;

import com.app.medicalwebapp.model.User;
import lombok.Data;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "contacts")
@Data
@DynamicUpdate
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "contactsOwner")
    private String contactsOwner;

    @ManyToMany
    @JoinTable(
            name = "contacts_users",
            joinColumns = @JoinColumn(name = "contact_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> contactsList;

    @ManyToMany
    @JoinTable(
            name = "contacts_chatrooms",
            joinColumns = @JoinColumn(name = "contact_id"),
            inverseJoinColumns = @JoinColumn(name = "chatroom_id")
    )
    private List<ChatRoom> chats;

}
