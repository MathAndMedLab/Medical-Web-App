package com.app.medicalwebapp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "notification")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="id")
    private Long id;

    @Column(name = "data")
    private String data;

    @Column(name = "creationTime")
    private LocalDateTime creationTime;

    @Column(name="timeZone")
    private String timeZone;

    @Column(name = "notificationType")
    private String notificationType;

    @Column(name = "notificationLink")
    private String notificationLink;

    @Column(name = "numberOfOwners")
    private int numberOfOwners;
}
