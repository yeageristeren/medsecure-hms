package com.medsecure.appointment.dto;

import com.medsecure.doctor.dto.DoctorResponseDto;
import com.medsecure.patient.dto.PatientResponseDto;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDto {
    private Long id;
    private LocalDateTime appointmentTime;
    private String reason;
    private String status;
    private DoctorResponseDto doctor;
    private PatientResponseDto patient;
}
