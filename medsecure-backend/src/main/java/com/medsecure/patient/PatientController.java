package com.medsecure.patient;

import com.medsecure.appointment.dto.AppointmentResponseDto;
import com.medsecure.appointment.dto.CreateAppointmentRequestDto;
import com.medsecure.common.response.ApiResponse;
import com.medsecure.patient.dto.PatientResponseDto;
import com.medsecure.appointment.AppointmentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
@Tag(name = "Patient APis")
public class PatientController {

    private final PatientService patientService;
    private final AppointmentService appointmentService;

    @PostMapping("/appointment")
    public ResponseEntity<AppointmentResponseDto> createNewAppointment(@RequestBody CreateAppointmentRequestDto createAppointmentRequestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.createNewAppointment(createAppointmentRequestDto));
    }

    @GetMapping("/profile")
    private ResponseEntity<ApiResponse<PatientResponseDto>> getPatientProfile() {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(patientService.getPatientByUsername(userName)
        ,"Patient profile displayed successfully"));
    }

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<Page<AppointmentResponseDto>>> getAllAppointmentsOfPatient(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ){
        Pageable pageable = PageRequest.of(page,size);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(appointmentService.getAllAppointmentsOfPatient(pageable),
                        "Patient Appointments")
        );
    }

    @PatchMapping("/appointment/{id}/cancel")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long id) throws AccessDeniedException {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.noContent().build();
    }
}
