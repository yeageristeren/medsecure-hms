package com.medsecure.appointment.dto;

import com.medsecure.common.type.AppointmentStatus;

public record UpdateAppointmentStatusRequest(
        AppointmentStatus status
) {
}
