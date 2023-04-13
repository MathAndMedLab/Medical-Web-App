package com.app.medicalwebapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@DynamicUpdate
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "firstname")
    private String firstname;

    @Column(name = "lastname")
    private String lastname;

    @Column(name = "patronymic")
    private String patronymic;

    @Column(name = "initials")
    private String initials;

    @JsonIgnore
    @Column(name = "password")
    private String password;

    @Column(name = "role")
    private String role;

    @Column(name = "registered_date")
    private LocalDateTime registeredDate;

    @Column(name = "status")
    private Integer status;

    @Column(name = "rate")
    private Integer rate;

    @Column(name = "active")
    private Active active;

    @Column(name = "avatar")
    private byte[] avatar;



    // Only for doctors, users have null on these columns
    @Column(name = "specialization", nullable = true)
    private String specialization;

    @Column(name = "specializedDiagnoses", nullable = true)
    private String specializedDiagnoses;

    @Column(name = "experience", nullable = true)
    private int experience;

    @Column(name = "workplace", nullable = true)
    private String workplace;

    @Column(name = "education", nullable = true)
    private String education;

    @Column(name = "price", nullable = true)
    private int price;
}

