package com.app.medicalwebapp.controllers;

import com.app.medicalwebapp.repositories.UserRepository;
import com.app.medicalwebapp.model.User;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;

import com.app.medicalwebapp.controllers.requestbody.NotificationRequest;
import com.app.medicalwebapp.security.UserDetailsImpl;
import com.app.medicalwebapp.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import com.app.medicalwebapp.model.Notification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 604800)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Autowired
    public NotificationController(NotificationService notificationService, UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllNotifications(@RequestParam Long userId) {
        try {
            List<Notification> l = notificationService.getAllNotifications(userId);
            return ResponseEntity.ok().body(l);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/save")
    public void saveNotification(@Valid @RequestBody NotificationRequest request)  {
        try {
            List<Long> userIds = request.getUserIds();
            for (Long userId : userIds) {
                User user = userRepository.getById(userId);
                if (user.getNotificationIds() == null) {
                    user.setNotificationIds(new Long[0]);
                }
            }

            var timeZoneUnparsed = ZonedDateTime.now().toString();
            String timeZone = timeZoneUnparsed.substring(timeZoneUnparsed.lastIndexOf("[") + 1).split("]")[0];

            Notification notification = Notification.builder()
                    .data(request.getData())
                    .creationTime(LocalDateTime.now())
                    .notificationType(request.getNotificationType())
                    .notificationLink(request.getNotificationLink())
                    .numberOfOwners(userIds.size())
                    .timeZone(timeZone)
                    .build();
            notificationService.saveNotification(notification, userIds);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteNotification(@RequestParam Long userId, @RequestParam Long id) {
        try {
            notificationService.deleteNotification(userId, id);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return ResponseEntity.ok().build();
    }

    private Long getAuthenticatedUserId() {
        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return principal != null ? principal.getId() : null;
    }
}
