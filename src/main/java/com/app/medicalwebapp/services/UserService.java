package com.app.medicalwebapp.services;

import com.app.medicalwebapp.model.User;
import com.app.medicalwebapp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllByUsername() {
        return userRepository.findAll(Sort.by(Sort.Direction.ASC, "username"));
    }

    public List<User> getAllByInitials() {
        return userRepository.findAll(Sort.by(Sort.Direction.ASC, "lastname"));
    }

    public User getById(Long id) {
        return userRepository.getOne(id);
    }

    public Optional<User> getByUsername(String username) {
        return userRepository.findByUsername(username);
    }

//    public List<User> getByInitials(String lastname, String firstname) {
//        System.out.println(userRepository.findByFirstnameOrLastnameContainingOrderByLastnameAscAllIgnoreCase(firstname, lastname));
//        return userRepository.findByFirstnameOrLastnameContainingOrderByLastnameAscAllIgnoreCase(firstname, lastname);
//    }

    public List<User> getByInitials(String initials) {
        System.out.println(userRepository.findByInitialsContainingOrderByInitialsAscAllIgnoreCase(initials));
        return userRepository.findByInitialsContainingOrderByInitialsAscAllIgnoreCase(initials);
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}