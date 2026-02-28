package com.medsecure.doctor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Page<Doctor> findAll(Pageable pageable);

    Page<Doctor> findBySpecializationAndDeleted(String specialisation, boolean b, Pageable pageable);
}