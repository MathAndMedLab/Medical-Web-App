package com.app.medicalwebapp.controllers;

import com.app.medicalwebapp.controllers.requestbody.JwtResponse;
import com.app.medicalwebapp.controllers.requestbody.MessageResponse;
import com.app.medicalwebapp.controllers.requestbody.SignInRequest;
import com.app.medicalwebapp.controllers.requestbody.SignUpRequest;
import com.app.medicalwebapp.controllers.requestbody.EditProfileRequest;
import com.app.medicalwebapp.model.Active;
import com.app.medicalwebapp.model.User;
import com.app.medicalwebapp.repositories.UserRepository;
import com.app.medicalwebapp.security.UserDetailsImpl;
import com.app.medicalwebapp.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;

@CrossOrigin(origins = "*", maxAge = 604800)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtHelper;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, PasswordEncoder encoder, JwtUtils jwtHelper) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtHelper = jwtHelper;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody SignInRequest signInRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signInRequest.getUsername(), signInRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtHelper.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        Optional<User> user = userRepository.findByUsernameAndRoleNotLike(signInRequest.getUsername(), "Модератор");
        List<Long> notificationIds = new ArrayList<>();
        if (user.isPresent()) {
            User user2 = user.get();
            user2.setActive(Active.ONLINE);
            userRepository.save(user2);
            if (user2.getNotificationIds() != null) {
                for (Long id : user2.getNotificationIds()) {
                    notificationIds.add(id);
                }
            }
        }
        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                roles,
                userDetails.getRate(),
                userDetails.getStatus(),
                userDetails.getRegisteredDate(),
                notificationIds,
                userDetails.getInitials())
        );
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Этот логин уже занят"));
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setInitials(signUpRequest.getInitials());
        user.setFirstname(signUpRequest.getFirstname());
        user.setLastname(signUpRequest.getLastname());
        user.setPatronymic(signUpRequest.getPatronymic());
        user.setRole(signUpRequest.getChosenRole());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setActive(Active.OFFLINE);
        user.setNotificationIds(null);

        //Only for doctors.
        user.setSpecialization(signUpRequest.getSpecialization());
        user.setSpecializedDiagnoses(signUpRequest.getSpecializedDiagnoses());
        user.setExperience(signUpRequest.getExperience());
        user.setWorkplace(signUpRequest.getWorkplace());
        user.setEducation(signUpRequest.getEducation());
        user.setPrice(signUpRequest.getPrice());
        //

//        user.setRealName(signUpRequest.getRealName());
//        user.setMobilePhone(signUpRequest.getMobilePhone());
        user.setStatus(0);
        user.setRate(0);
        user.setRegisteredDate(LocalDateTime.now());
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Пользователь был успешно зарегистрирован"));
    }

    @GetMapping("/logout")
    public void logOut(@RequestParam String username) {
        Optional<User> user = userRepository.findByUsernameAndRoleNotLike(username, "Модератор");
        if (user.isPresent()) {
            User user2 = user.get();
            user2.setActive(Active.OFFLINE);
            userRepository.save(user2);
        }
    }

    @GetMapping("/checktoken")
    public ResponseEntity<?> checkTokenExpiration(@RequestParam String token) {
        if (jwtHelper.validateJwtToken(token)) {
            return ResponseEntity.ok("JWT token is valid");
        } else {
            return new ResponseEntity("JWT token is not valid", HttpStatus.EXPECTATION_FAILED);
        }
    }

    @PostMapping("/edit")
    public void editProfile(@Valid @RequestBody EditProfileRequest editProfileRequest) {

        Optional<User> user = userRepository.findByUsernameAndRoleNotLike(editProfileRequest.getUsername(), "Модератор");
        if (user.isPresent()) {
            User user2 = user.get();
            user2.setInitials(editProfileRequest.getInitials());
            user2.setFirstname(editProfileRequest.getFirstname());
            user2.setLastname(editProfileRequest.getLastname());
            user2.setPatronymic(editProfileRequest.getPatronymic());
            user2.setEducation(editProfileRequest.getEducation());
            user2.setSpecialization(editProfileRequest.getSpecialization());
            user2.setSpecializedDiagnoses(editProfileRequest.getSpecializedDiagnoses());
            user2.setWorkplace(editProfileRequest.getWorkplace());
            user2.setExperience(editProfileRequest.getExperience());
            user2.setPrice(editProfileRequest.getPrice());
            userRepository.save(user2);
        }
    }
}

