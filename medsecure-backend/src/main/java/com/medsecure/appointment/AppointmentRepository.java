package com.medsecure.appointment;

import com.medsecure.common.type.AppointmentStatus;
import com.medsecure.doctor.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    void removeAppointmentById(Long id);

    Page<Appointment> getAppointmentsByDoctor_Id(Long doctorId, Pageable pageable);

    boolean existsByAppointmentTimeAndDoctor_IdAndStatusIn(LocalDateTime appointmentTime, Long doctorId, List<AppointmentStatus> pending);


    Long countAppointmentByAppointmentTimeBetween(LocalDateTime localDateTime, LocalDateTime localDateTime1);

    @Query(nativeQuery = true, value = "select status, count(*) from appointment group by status")
    List<Object[]> getAppointmentStats();

    Page<Appointment> getAppointmentsByPatient_Id(Long id, Pageable pageable);
}