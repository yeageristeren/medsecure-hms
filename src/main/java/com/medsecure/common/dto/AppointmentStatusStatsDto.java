package com.medsecure.common.dto;

public record AppointmentStatusStatsDto(
        Long pending,
        Long confirmed,
        Long completed,
        Long cancelled,
        Long rejected
) {

}
