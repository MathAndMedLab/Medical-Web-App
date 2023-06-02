package com.app.medicalwebapp.repositories;

import com.app.medicalwebapp.model.Notification;
import com.app.medicalwebapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Notification getById(Long id);
}
