package com.app.medicalwebapp.controllers;

import com.app.medicalwebapp.controllers.requestbody.NotificationRequest;
import com.app.medicalwebapp.security.UserDetailsImpl;
import com.app.medicalwebapp.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import com.app.medicalwebapp.model.Notification;

@CrossOrigin(origins = "*", maxAge = 604800)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
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
            notificationService.saveNotification(request);
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
