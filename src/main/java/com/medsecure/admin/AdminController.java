package com.medsecure.admin;

import com.medsecure.appointment.AppointmentService;
import com.medsecure.appointment.dto.AppointmentResponseDto;
import com.medsecure.common.dto.AppointmentStatusStatsDto;
import com.medsecure.common.dto.Dashboard;
import com.medsecure.common.dto.SystemStatsDto;
import com.medsecure.common.response.ApiResponse;
import com.medsecure.department.DepartmentRepository;
import com.medsecure.department.DepartmentResponseDto;
import com.medsecure.department.DepartmentService;
import com.medsecure.department.NewDepartmentRequestDto;
import com.medsecure.doctor.dto.DoctorResponseDto;
import com.medsecure.patient.dto.PatientResponseDto;
import com.medsecure.doctor.dto.DoctorRequestDto;
import com.medsecure.patient.PatientRepository;
import com.medsecure.doctor.DoctorService;
import com.medsecure.patient.PatientService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Tag(name = "Admin APIs")
public class AdminController {

    private final PatientService patientService;
    private final DoctorService doctorService;
    private final AppointmentService appointmentService;
    private final DashboardService dashboardService;
    private final DepartmentService departmentService;

    @GetMapping("/dashboard/system")
    public ResponseEntity<ApiResponse<Dashboard>> getDashboard(){

        return ResponseEntity.ok(ApiResponse.success(
                new Dashboard(dashboardService.getSystemStats(),dashboardService.getAppointmentStats())
                ,"Admin Dashboard..."));
    }

    @GetMapping("/patients")
    public ResponseEntity<List<PatientResponseDto>> getAllPatients(
            @RequestParam(value = "page", defaultValue = "0") Integer pageNumber,
            @RequestParam(value = "size", defaultValue = "10") Integer pageSize
    ) {
        return ResponseEntity.ok(patientService.getAllPatients(pageNumber, pageSize));
    }


    @PostMapping("/doctor")
    public ResponseEntity<ApiResponse<DoctorResponseDto>> onBoardNewDoctor(@RequestBody DoctorRequestDto doctorRequestDto){
        DoctorResponseDto dto = doctorService.onBoardNewDoctor(doctorRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(dto,"Doctor onboarded"));
    }

    @GetMapping("/appointments")
    public ResponseEntity<Page<AppointmentResponseDto>> getAllAppointments(
            @RequestParam int page,@RequestParam int size){
        Pageable pageable = PageRequest.of(page,size);
        Page<AppointmentResponseDto> appointments = appointmentService.getAllAppointments(pageable);
        return ResponseEntity.ok(appointments);
    }

    @DeleteMapping("/doctor/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable Long id){
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.success(null,"Doctor deleted form System"));
    }

    @PostMapping("/department")
    public ResponseEntity<ApiResponse<DepartmentResponseDto>> addNewDepartment(
            @RequestBody NewDepartmentRequestDto dto
    ){
        return new ResponseEntity<>(ApiResponse.success
                (departmentService.addNewDepartment(dto),"New Department Successfully added")
                ,HttpStatus.CREATED);
    }

    @PostMapping("/doctors/{doctorId}/department")
    public ResponseEntity<ApiResponse<Void>> addDoctorToDepartment(
            @PathVariable Long doctorId,
            @RequestBody Long departmentId
    ){
        doctorService.addDoctorToDepartment(doctorId,departmentId);
        return ResponseEntity.ok(ApiResponse.success(null,"Successfully added"));
    }
}
