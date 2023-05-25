package com.app.medicalwebapp.services.messenger_services;

import com.app.medicalwebapp.controllers.requestbody.messenger.MemberRequest;
import com.app.medicalwebapp.model.messenger_models.ChatRoom;
import com.app.medicalwebapp.repositories.messenger_repositories.ChatRoomRepository;
import lombok.Getter;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    public ChatRoomService(ChatRoomRepository chatRoomRepository) {
        this.chatRoomRepository = chatRoomRepository;
    }

}
