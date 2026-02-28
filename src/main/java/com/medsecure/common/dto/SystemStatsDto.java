package com.medsecure.common.dto;

public record SystemStatsDto(
        Long totalDoctors,
        Long totalPatients,
        Long totalAppointments,
        Long todayAppointments,
        Long weeklyAppointments,
        Long monthlyAppointments
) {
    
}
