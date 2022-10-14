package com.app.medicalwebapp.controllers;

import com.app.medicalwebapp.controllers.requestbody.MessageResponse;
import com.app.medicalwebapp.controllers.requestbody.messenger.ContactsRequest;
import com.app.medicalwebapp.controllers.requestbody.messenger.ContactsResponse;
import com.app.medicalwebapp.model.User;
import com.app.medicalwebapp.model.messenger_models.ChatMessage;
import com.app.medicalwebapp.model.messenger_models.Contact;
import com.app.medicalwebapp.security.UserDetailsImpl;
import com.app.medicalwebapp.services.UserService;
import com.app.medicalwebapp.services.messenger_services.ChatMessageService;
import com.app.medicalwebapp.services.messenger_services.ContactsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 604800)
@RestController
@RequestMapping("/api/search")
public class UserController {
    private final UserService userService;
    private final ContactsService contactsService;
    private final ChatMessageService chatMessageService;

    @Autowired
    public UserController(UserService userService, ContactsService contactsService, ChatMessageService chatMessageService) {
        this.userService = userService;
        this.contactsService = contactsService;
        this.chatMessageService = chatMessageService;
    }

    @GetMapping("/all/username")
    public ResponseEntity<?> getAllByUsername(
            @RequestParam(name = "username", required = false, defaultValue = "empty") String username
    ) {
        try {
            if (username.equals("empty")) {
                List<User> responseBody;
                responseBody = userService.getAll();
                return ResponseEntity.ok().body(responseBody);
            } else {
                Optional<User> responseBody;
                List<Optional<User>> responseBody2 = new ArrayList<>();
                responseBody = userService.getOneByUsername(username);
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

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            userService.uploadUserAvatar(file.getBytes(), getAuthenticatedUser().getId());
            return ResponseEntity.ok().body(new MessageResponse("Успешно загружены файлы: " + file.getOriginalFilename()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Ошибка при загрузке файлa"));
        }
    }

    @GetMapping("/username")
    public ResponseEntity<?> getByUsername(
            @RequestParam(name = "username", required = false, defaultValue = "empty") String username,
            @RequestParam String role
    ) {
        try {
            if (username.equals("empty")) {
                List<User> responseBody;
                responseBody = userService.getAllByRole(role);
                return ResponseEntity.ok().body(responseBody);
            } else {
                Optional<User> responseBody;
                List<Optional<User>> responseBody2 = new ArrayList<>();
                responseBody = userService.getOneByUsernameAndRole(username, role);
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

    @GetMapping("/all/initials")
    public ResponseEntity<?> getAllByInitials(
            @RequestParam(name = "initials", required = false, defaultValue = "empty") String initials
    ) {
        try {
            if (initials.equals("empty")) {
                List<User> responseBody;
                responseBody = userService.getAll();
                return ResponseEntity.ok().body(responseBody);
            } else {
                List<User> responseBody;
                responseBody = userService.getByInitials(initials);
                return ResponseEntity.ok().body(responseBody);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/initials")
    public ResponseEntity<?> getByInitials(
            @RequestParam(name = "initials", required = false, defaultValue = "empty") String initials,
            @RequestParam String role
    ) {
        try {
            if (initials.equals("empty")) {
                List<User> responseBody;
                responseBody = userService.getAllByRole(role);
                return ResponseEntity.ok().body(responseBody);
            } else {
                List<User> responseBody;
                responseBody = userService.getByInitialsAndRole(initials, role);
                return ResponseEntity.ok().body(responseBody);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/contacts")
    public ResponseEntity<?> getContacts(@RequestParam String currentUserUsername) {
        try {
            Optional<Contact> contactOptional = contactsService.getByContactsOwner(currentUserUsername);
            List<User> contactsList;
            ContactsResponse contactWithLastMsg = new ContactsResponse();
            contactWithLastMsg.setContactWithLastMsg(new ArrayList<>());
            var contacts = contactWithLastMsg.getContactWithLastMsg();
            if (contactOptional.isPresent()) {
                contactsList = contactOptional.get().getContactsList();
                for (User user : contactsList) {
                    String chatId;
                    if (user.getUsername().compareTo(currentUserUsername) < 0) {
                        chatId = (user.getUsername() + currentUserUsername);
                    } else {
                        chatId = (currentUserUsername + user.getUsername());
                    }
                    Optional<ChatMessage> lastMessage = chatMessageService.findFirstByChatIdOrderBySendDateDesc(chatId);

                    if (lastMessage.isPresent()) {
                        contacts.add(Pair.of(user, lastMessage.get()));
                    } else {
                        contacts.add(Pair.of(user, new ChatMessage()));
                    }
                }
                contactWithLastMsg.setContactWithLastMsg(contacts);
            }
            return ResponseEntity.ok().body(contactWithLastMsg);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/contacts")
    public ResponseEntity<?> pushContacts(
            @RequestBody ContactsRequest request
    ) {
        try {
            User user = push(request.getCurrentUserUsername(), request.getSelectedUserUsername());
            if (push(request.getSelectedUserUsername(), request.getCurrentUserUsername()) == null) {
                return ResponseEntity.badRequest().body("Пользователя с данным логином не существует");
            }
            if (user == null) {
                return ResponseEntity.badRequest().body("Пользователя с данным логином не существует");
            }
            return ResponseEntity.ok().body(user);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public User push(String currentUserUsername, String selectedUserUsername) {
        Optional<Contact> contactsOptional = contactsService.getByContactsOwner(currentUserUsername);
        Contact contact;
        if (contactsOptional.isPresent()) {
            contact = contactsOptional.get();
        } else {
            contact = new Contact();
            contact.setContactsOwner(currentUserUsername);
            contact.setContactsList(new ArrayList<>());
        }
        Optional<User> userOptional = userService.getOneByUsername(selectedUserUsername);
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            return null;
        }
        List<User> userList = contact.getContactsList();
        userList.add(user);
        contact.setContactsList(userList);
        contactsService.save(contact);
        return user;
    }

    private UserDetailsImpl getAuthenticatedUser() {
        return (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

}
