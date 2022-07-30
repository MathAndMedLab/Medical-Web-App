package com.app.medicalwebapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "files")
public class FileObject {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "initial_name")
    private String initialName;

    @JsonIgnore
    @Column(name = "format")
    @Enumerated(EnumType.STRING)
    private FileObjectFormat format;

    @JsonIgnore
    @Column(name = "path_to_file")
    private String pathToFile;

    @Column(name = "owner")
    private Long owner;

    @Column(name = "creation_time")
    private LocalDateTime creationTime;

    @Column(name = "size")
    private Integer size;

    @Column(name = "study_instance_uid")
    private String UID;

    @Column(name = "deleted")
    private boolean deleted;

    @Transient
    private String downloadLink;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER,
            cascade = { CascadeType.PERSIST, CascadeType.DETACH,
                    CascadeType.MERGE, CascadeType.REFRESH} )
    @JoinTable(
            name = "record_to_file",
            joinColumns = { @JoinColumn(name = "file_id") },
            inverseJoinColumns = { @JoinColumn(name = "record_id") }
    )
    Set<Record> records = new HashSet<>();

    @PreRemove
    private void removeEducationFromUsersProfile() {
        for (var u : records) {
            u.getAttachments().remove(this);
        }
    }
}
