package com.medsecure.doctor;

import com.medsecure.appointment.dto.AppointmentResponseDto;
import com.medsecure.appointment.AppointmentService;
import com.medsecure.appointment.dto.UpdateAppointmentStatusRequest;
import com.medsecure.common.response.ApiResponse;
import com.medsecure.common.type.AppointmentStatus;
import com.medsecure.doctor.dto.DoctorRequestDto;
import com.medsecure.doctor.dto.DoctorResponseDto;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
@Tag(name ="Doctor APIs")
public class DoctorController {

    private final AppointmentService appointmentService;
    private final DoctorService doctorService;

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<Page<AppointmentResponseDto>>> getAllAppointmentsOfDoctor(
            @RequestParam(defaultValue =  "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page,size);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.status(HttpStatus.FOUND)
                .body(ApiResponse.success
                        (appointmentService.getAllAppointmentsOfDoctor(username,pageable),
                                "Retrieved the appointments of logged in doctor"));
    }

    @PatchMapping("/appointments/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id,
                                                @RequestBody UpdateAppointmentStatusRequest status) throws AccessDeniedException {
        appointmentService.updateAppointmentStatus(id,status);
        return ResponseEntity.noContent().build();
    }
}
