package com.app.medicalwebapp.repositories;

import com.app.medicalwebapp.model.FileObject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileObjectRepository extends JpaRepository<FileObject, Long> {

    List<FileObject> findByOwner(Long userId);

    List<FileObject> findByOwnerAndDeleted(Long userId, boolean deleted);

    Optional<FileObject> findById(Long fileId);

}
