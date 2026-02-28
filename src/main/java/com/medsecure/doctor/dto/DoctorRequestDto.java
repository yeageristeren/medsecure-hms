package com.medsecure.doctor.dto;

import lombok.Data;

@Data
public class DoctorRequestDto {
    private Long id;
    private String name;
    private String email;
    private String specialization;
}
