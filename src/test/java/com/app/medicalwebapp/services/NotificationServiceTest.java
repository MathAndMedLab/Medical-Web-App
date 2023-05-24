package com.app.medicalwebapp;

import java.util.List;
import java.util.Set;
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
        User user = new User();
        user.setId(777L);
        Long[] userNotificationIds = new Long[1];
        userNotificationIds[0] = 778L;
        user.setNotificationIds(userNotificationIds);

        Mockito.doReturn(user)
                .when(userRepository)
                .getById(777L);
        User userFound = userService.getById(777L);

        Mockito.verify(userRepository, Mockito.times(1)).getById(777L);

        List<Long> userIds = new ArrayList<Long>();
        userIds.add(userFound.getId());

        Notification notification = new Notification();
        notification.setData("Test notification right here.");
        notification.setNotificationType("testNotification");
        notification.setNotificationLink("testLink");
        notification.setId(778L);

        Mockito.doReturn(notification)
                .when(notificationRepository)
                .getById(778L);

        Notification notificationFound = notificationRepository.getById(778L);

        Mockito.verify(notificationRepository, Mockito.times(1)).getById(778L);

        // Saving...
        notificationService.saveNotification(notificationFound, userIds);
        Mockito.verify(notificationRepository, Mockito.times(1)).save(notificationFound);

        // Let's take all user's notifications...
        List<Notification> l = notificationService.getAllNotifications(777L);
        Mockito.verify(notificationRepository, Mockito.times(3)).getById(778L);

        assertEquals(l.get(0).getData(), "Test notification right here.");
    }

    public void deleteNotificationTest()
    {
        User user = new User();
        user.setId(888L);
        Long[] userNotificationIds = new Long[1];
        userNotificationIds[0] = 889L;
        user.setNotificationIds(userNotificationIds);

        Mockito.doReturn(user)
                .when(userRepository)
                .getById(888L);
        User userFound = userService.getById(888L);

        Mockito.verify(userRepository, Mockito.times(1)).getById(888L);

        List<Long> userIds = new ArrayList<Long>();
        userIds.add(userFound.getId());

        Notification notification = new Notification();
        notification.setData("Test notification right here.");
        notification.setId(889L);

        Mockito.doReturn(notification)
                .when(notificationRepository)
                .getById(889L);

        Notification notificationFound = notificationRepository.getById(889L);

        Mockito.verify(notificationRepository, Mockito.times(1)).getById(778L);

        // Deleting...
        notificationService.deleteNotification(888L, 889L);

        User userFound1 = userService.getById(888L);
        Mockito.verify(userRepository, Mockito.times(1)).getById(888L);

        assertEquals(0, userFound1.getNotificationIds().length);
    }

    public void Delete
}
