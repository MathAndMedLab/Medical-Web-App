package com.app.medicalwebapp.model;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "role")
    private String role;

    @Column(name= "registered_date")
    private LocalDateTime registeredDate;

    @Column(name = "status")
    private Integer status;

    @Column(name = "rate")
    private Integer rate;
}

