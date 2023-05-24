package com.app.medicalwebapp;
import java.util.List;
import java.util.ArrayList;

import com.app.medicalwebapp.model.User;
import com.app.medicalwebapp.repositories.UserRepository;
import com.app.medicalwebapp.services.UserService;

import com.app.medicalwebapp.model.Notification;
import com.app.medicalwebapp.repositories.NotificationRepository;
import com.app.medicalwebapp.services.NotificationService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.mockito.Mockito;
import org.springframework.test.context.junit4.SpringRunner;
import org.junit.runner.RunWith;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class NotificationServiceTest {

    @Autowired
    NotificationService notificationService;

    @MockBean
    UserRepository userRepository;

    @MockBean
    NotificationRepository notificationRepository;

    @Autowired
    private UserService userService;

    @Test
    public void saveNotificationAndgetAllNotificationsTest() {
        var userId = 777L;
        var notificationId = 778L;

        User user = new User();
        user.setId(userId);
        Long[] userNotificationIds = new Long[1];
        userNotificationIds[0] = notificationId;
        user.setNotificationIds(userNotificationIds);

        Mockito.doReturn(user)
                .when(userRepository)
                .getById(userId);
        User userFound = userService.getById(userId);

        Mockito.verify(userRepository, Mockito.times(1)).getById(userId);

        List<Long> userIds = new ArrayList<Long>();
        userIds.add(userFound.getId());

        Notification notification = new Notification();
        notification.setData("Test notification right here.");
        notification.setNotificationType("testNotification");
        notification.setNotificationLink("testLink");
        notification.setId(notificationId);

        Mockito.doReturn(notification)
                .when(notificationRepository)
                .getById(notificationId);

        Notification notificationFound = notificationRepository.getById(notificationId);

        Mockito.verify(notificationRepository, Mockito.times(1)).getById(notificationId);

        // Saving...
        notificationService.saveNotification(notificationFound, userIds);
        Mockito.verify(notificationRepository, Mockito.times(1)).save(notificationFound);

        // Let's take all user's notifications...
        List<Notification> l = notificationService.getAllNotifications(userId);
        Mockito.verify(notificationRepository, Mockito.times(3)).getById(notificationId);

        assertEquals("Test notification right here.", l.get(0).getData());
    }

    @Test
    public void deleteNotificationTest()
    {
        var userId = 888L;
        var notificationId = 889L;

        User user = new User();
        user.setId(userId);
        Long[] userNotificationIds = new Long[4];
        userNotificationIds[0] = 111L;
        userNotificationIds[1] =  notificationId;
        userNotificationIds[2] =  555L;
        userNotificationIds[3] =  444L;
        user.setNotificationIds(userNotificationIds);

        Mockito.doReturn(user)
                .when(userRepository)
                .getById(userId);
        User userFound = userService.getById(userId);

        Mockito.verify(userRepository, Mockito.times(1)).getById(userId);

        List<Long> userIds = new ArrayList<Long>();
        userIds.add(userFound.getId());

        Notification notification = new Notification();
        notification.setData("Test notification right here.");
        notification.setId(notificationId);

        Mockito.doReturn(notification)
                .when(notificationRepository)
                .getById(notificationId);

        Notification notificationFound = notificationRepository.getById(notificationId);

        Mockito.verify(notificationRepository, Mockito.times(1)).getById(notificationId);

        // Deleting...
        notificationService.deleteNotification(userId, notificationId);
        Mockito.verify(notificationRepository, Mockito.times(1)).delete(notificationFound);

        User userFound1 = userService.getById(userId);
        Mockito.verify(userRepository, Mockito.times(3)).getById(userId);

        assertEquals(3, userFound1.getNotificationIds().length);
    }

    @Test
    public void getAllNotificationsForUserWithoutNotificationsTest()
    {
        var userId = 555L;
        User user = new User();
        user.setId(userId);

        Mockito.doReturn(user)
                .when(userRepository)
                .getById(userId);
        User userFound = userService.getById(userId);

        Mockito.verify(userRepository, Mockito.times(1)).getById(userId);

        List<Notification> l = notificationService.getAllNotifications(userId);

        assertEquals(0, l.size());
    }
}
