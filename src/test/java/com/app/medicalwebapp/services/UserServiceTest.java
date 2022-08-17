package com.app.medicalwebapp.services;

import com.app.medicalwebapp.model.User;
import com.app.medicalwebapp.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
class UserServiceTest {

    @Autowired
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @Test
    void getAll() {
        User user1 = new User();
        User user2 = new User();
        user1.setUsername("user1");
        user2.setUsername("user2");

        Mockito.doReturn(List.of(user1, user2))
                .when(userRepository)
                .findByRoleNotLikeOrderByInitialsAsc("Модератор");
        List<User> userFound = userService.getAll();
        Mockito.verify(userRepository, Mockito.times(1)).findByRoleNotLikeOrderByInitialsAsc("Модератор");
        assertEquals(user1, userFound.get(0));
        assertEquals(user2, userFound.get(1));
    }

    @Test
    void getOneByUsername() {
        User user = new User();
        user.setUsername("mockObject");

        Mockito.doReturn(Optional.of(user))
                .when(userRepository)
                .findByUsernameAndRoleNotLike("mockObject", "Модератор");
        Optional<User> userFound = userService.getOneByUsername("mockObject");
        Mockito.verify(userRepository, Mockito.times(1)).findByUsernameAndRoleNotLike("mockObject", "Модератор");
        if (userFound.isPresent()) {
            User userFound1 = userFound.get();
            assertEquals(user, userFound1);
        }
    }

    @Test
    void getOneByUsernameAndRole() {
        User user = new User();
        user.setUsername("mockObject");
        user.setRole("Пользователь");

        Mockito.doReturn(Optional.of(user))
                .when(userRepository)
                .findByUsernameAndRole("mockObject", "Пользователь");
        Optional<User> userFound = userService.getOneByUsernameAndRole("mockObject", "Пользователь");
        Mockito.verify(userRepository, Mockito.times(1)).findByUsernameAndRole("mockObject", "Пользователь");
        if (userFound.isPresent()) {
            User userFound1 = userFound.get();
            assertEquals(user, userFound1);
        }
    }

    @Test
    void getByInitials() {
        User user = new User();
        user.setInitials("Петров Петр");

        Mockito.doReturn(List.of(user))
                .when(userRepository)
                .findByInitialsContainingAndRoleNotLikeOrderByInitialsAscAllIgnoreCase("Петров Петр", "Модератор");
        List<User> userFound = userService.getByInitials("Петров Петр");
        Mockito.verify(userRepository, Mockito.times(1)).findByInitialsContainingAndRoleNotLikeOrderByInitialsAscAllIgnoreCase("Петров Петр", "Модератор");
        assertEquals(user, userFound.get(0));
    }

    @Test
    void getAllByRole() {
        User user = new User();
        user.setRole("Врач");

        Mockito.doReturn(List.of(user))
                .when(userRepository)
                .findByRoleOrderByInitialsAsc("Врач");
        List<User> userFound = userService.getAllByRole("Врач");
        Mockito.verify(userRepository, Mockito.times(1)).findByRoleOrderByInitialsAsc("Врач");
        assertEquals(user, userFound.get(0));
    }

    @Test
    void getByInitialsAndRole() {
        User user = new User();
        user.setInitials("Петров Петр");
        user.setRole("Врач");

        Mockito.doReturn(List.of(user))
                .when(userRepository)
                .findByInitialsContainingAndRoleOrderByInitialsAscAllIgnoreCase("Петров Петр", "Врач");
        List<User> userFound = userService.getByInitialsAndRole("Петров Петр", "Врач");
        Mockito.verify(userRepository, Mockito.times(1)).findByInitialsContainingAndRoleOrderByInitialsAscAllIgnoreCase("Петров Петр", "Врач");
        assertEquals(user, userFound.get(0));
    }

    @Test
    void getById() {
        User user = new User();
        user.setId(777L);

        Mockito.doReturn(user)
                .when(userRepository)
                .getById(777L);
        User userFound = userService.getById(777L);
        Mockito.verify(userRepository, Mockito.times(1)).getById(777L);
        assertEquals(user, userFound);
    }

    @Test
    void save() {
        User user = new User();
        user.setUsername("mockObject");

        userService.save(user);
        Mockito.verify(userRepository, Mockito.times(1)).save(user);
    }
}