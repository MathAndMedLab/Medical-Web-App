package com.app.medicalwebapp.controllers;

import com.app.medicalwebapp.model.User;
import com.app.medicalwebapp.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 604800)
@RestController
@RequestMapping("/api/search")
public class UserController {
    Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    UserService userService;

    @GetMapping("/all/usersByUsername")
    public ResponseEntity<?> getAllUsersByUsername(
            @RequestParam(name = "username", required = false, defaultValue = "empty") String username
    ) {
        try {
            if (username.equals("empty")) {
                List<User> responseBody;
                responseBody = userService.getAllByUsername();
                return ResponseEntity.ok().body(responseBody);
            } else {
                Optional<User> responseBody;
                List<Optional<User>> responseBody2 = new ArrayList<>();
                responseBody = userService.getByUsername(username);
                if (responseBody.isPresent()) {
                    responseBody2.add(responseBody);
                }
                return ResponseEntity.ok().body(responseBody2);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all/usersByInitials")
    public ResponseEntity<?> getAllUsersByInitials(
            @RequestParam(name = "initials", required = false, defaultValue = "empty") String initials
//            @RequestParam(name = "lastname", required = false, defaultValue = "empty") String lastname,
//            @RequestParam(name = "firstname", required = false, defaultValue = "empty") String firstname
    ) {
        try {
            if (initials.equals("empty")) {
                List<User> responseBody;
                responseBody = userService.getAllByInitials();
                return ResponseEntity.ok().body(responseBody);
            } else {
                List<User> responseBody;
//                List<Optional<User>> responseBody2 = new ArrayList<>();
                responseBody = userService.getByInitials(initials);
//                if (responseBody.isPresent()) {
//                    responseBody2.add(responseBody);
//                }
                System.out.println(initials);
                System.out.println(responseBody);
                return ResponseEntity.ok().body(responseBody);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
