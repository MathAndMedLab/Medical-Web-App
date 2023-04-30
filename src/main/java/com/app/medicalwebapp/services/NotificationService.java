package com.app.medicalwebapp.services;

import java.util.ArrayList;
import com.app.medicalwebapp.repositories.UserRepository;
import com.app.medicalwebapp.repositories.NotificationRepository;
import com.app.medicalwebapp.controllers.requestbody.NotificationRequest;
import com.app.medicalwebapp.model.Notification;
import com.app.medicalwebapp.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    @Autowired
    public NotificationService(UserRepository userRepository, NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    // Сохраняем одно одинаковое уведомление для списка пользователей.
    public void saveNotification(NotificationRequest request) {
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

        notificationRepository.save(notification);

        for (Long userId : userIds) {
            User user = userRepository.getById(userId);
            Long[] userNotificationsIds = user.getNotificationIds();
            Long[] newUserNotificationsIds = new Long[userNotificationsIds.length + 1];
            for (int i = 0; i < userNotificationsIds.length; i++) {
                newUserNotificationsIds[i] = userNotificationsIds[i];
            }
            newUserNotificationsIds[userNotificationsIds.length] = notification.getId();
            user.setNotificationIds(newUserNotificationsIds);
            userRepository.save(user);
        }
    }

    public List<Notification> getAllNotifications(Long user_id) {
        User user = userRepository.getById(user_id);
        if (user.getNotificationIds() == null) {
            user.setNotificationIds(new Long[0]);
        }
        Long[] userNotificationIds = user.getNotificationIds();
        List<Notification> notifications = new ArrayList<>();
        for (Long id : userNotificationIds) {
            notifications.add(notificationRepository.getById(id));
        }
        return notifications;
    }

    public void deleteNotification(Long user_id, Long id) {
        User user = userRepository.getById(user_id);
         Long[] userNotificationsIds = user.getNotificationIds();
         Long[] newUserNotificationsIds = new Long[userNotificationsIds.length - 1];
         Boolean flag = false;
         System.out.println("CHECKING: ");
         System.out.println(userNotificationsIds[0]);
         System.out.println(id);
         System.out.println(userNotificationsIds[0].equals(id));
         for (int i = 0; i < userNotificationsIds.length; i++) {
            if (userNotificationsIds[i].equals(id)) {
                flag = true;
            }
            else {
                if (!flag) {
                    newUserNotificationsIds[i] = userNotificationsIds[i];
                }
                else {
                    newUserNotificationsIds[i - 1] = userNotificationsIds[i];
                }
            }
         }
        user.setNotificationIds(newUserNotificationsIds);
        userRepository.save(user);

        Notification n = notificationRepository.getById(id);
        int numberOfOwners = n.getNumberOfOwners();
        if (numberOfOwners - 1 <= 0) {
            notificationRepository.delete(n);
        }
        else {
            n.setNumberOfOwners(numberOfOwners - 1);
            notificationRepository.save(n);
        }
    }
}
