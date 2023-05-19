package com.app.medicalwebapp.repositories.messenger_repositories;

import com.app.medicalwebapp.model.User;
import com.app.medicalwebapp.model.messenger_models.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    List<ChatRoom> findAllByMembersContains (Long memberIds);

    ChatRoom findChatRoomByChatId (String chatId);

}
