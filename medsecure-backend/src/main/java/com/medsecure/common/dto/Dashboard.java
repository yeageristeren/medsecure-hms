package com.medsecure.common.dto;

public record Dashboard(
        SystemStatsDto systemStats,
        AppointmentStatusStatsDto appointmentStats
) {
}
