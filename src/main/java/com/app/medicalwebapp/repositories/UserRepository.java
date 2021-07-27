package com.app.medicalwebapp.repositories;

import com.app.medicalwebapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

//    List<User> findByFirstnameOrLastnameContainingOrderByLastnameAscAllIgnoreCase(String firstname, String lastname);

    List<User> findByInitialsContainingOrderByInitialsAscAllIgnoreCase(String initials);

}
