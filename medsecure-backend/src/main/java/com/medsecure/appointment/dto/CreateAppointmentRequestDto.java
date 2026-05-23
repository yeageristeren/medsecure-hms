package com.medsecure.appointment.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateAppointmentRequestDto {
    private Long doctorId;
    private LocalDateTime appointmentTime;
    private String reason;
}
