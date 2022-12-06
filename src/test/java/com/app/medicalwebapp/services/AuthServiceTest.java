package com.app.medicalwebapp;

import com.app.medicalwebapp.model.User;
import org.junit.jupiter.api.Test;
import com.app.medicalwebapp.controllers.requestbody.EditProfileRequest;
import com.app.medicalwebapp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = {"postgres.port=5555"})
public class AuthServiceTest {
    @Autowired
    UserRepository userRepository;

    @Test
    public void editProfileTest() {
        User user = new User();
        user.setUsername("user");
        user.setFirstname("firstname");
        user.setLastname("lastname");
        user.setPatronymic("patronymic");
        user.setInitials("firstname lastname patronymic");
        user.setRole("Пользователь");
        EditProfileRequest editProfileRequest = new EditProfileRequest();
        editProfileRequest.setUsername("user");
        editProfileRequest.setFirstname("test_firstname");
        editProfileRequest.setLastname("test_lastname");
        editProfileRequest.setPatronymic("test_patronymic");
        editProfileRequest.setInitials("test_firstname test_lastname test_patronymic");
        // AuthService.editProfile
        user.setInitials(editProfileRequest.getInitials());
        user.setFirstname(editProfileRequest.getFirstname());
        user.setLastname(editProfileRequest.getLastname());
        user.setPatronymic(editProfileRequest.getPatronymic());
        user.setEducation(editProfileRequest.getEducation());
        user.setSpecialization(editProfileRequest.getSpecialization());
        user.setWorkplace(editProfileRequest.getWorkplace());
        user.setExperience(editProfileRequest.getExperience());
        //
        assertEquals(user.getFirstname(), "test_firstname");
        assertEquals(user.getLastname(), "test_lastname");
        assertEquals(user.getPatronymic(), "test_patronymic");
        assertEquals(user.getInitials(), "test_firstname test_lastname test_patronymic");
        assertEquals(user.getEducation(), null);
    }
}
