package com.medsecure.publicapi;

import com.medsecure.common.response.ApiResponse;
import com.medsecure.department.DepartmentResponseDto;
import com.medsecure.department.DepartmentService;
import com.medsecure.doctor.dto.DoctorResponseDto;
import com.medsecure.doctor.DoctorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
@Tag(name = "Hospital APIs")
public class HospitalController {

    private final DoctorService doctorService;
    private final DepartmentService departmentService;

    @GetMapping("/doctors")
    public ResponseEntity<Page<DoctorResponseDto>> getAllDoctors(@RequestParam(defaultValue = "5") int size,
                                                                 @RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "id") String sortby,
                                                                 @RequestParam(defaultValue = "asc") String direction) {
        Sort sort;
        if(direction.equalsIgnoreCase("desc")){
            sort = Sort.by(sortby).descending();
        }else{
            sort = Sort.by(sortby).ascending();
        }
        Pageable pageable = PageRequest.of(page,size,sort);
        return ResponseEntity.ok(doctorService.getAllDoctors(pageable));
    }

    @GetMapping("/doctor")
    public ResponseEntity<ApiResponse<Page<DoctorResponseDto>>> getAvailableDoctorsBySpec(
            @RequestParam(required = false) String specialization,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "name") String sortby
            ){
        Pageable pageable = PageRequest.of(page,size,Sort.by(sortby));
        Page<DoctorResponseDto> doctors = doctorService.findAvailBySpec(specialization,pageable);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success
                (doctors,"Doctors with specs are found"));
    }

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<Page<DepartmentResponseDto>>> getAllDepartments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ){
        Pageable pageable = PageRequest.of(page,size);
        return ResponseEntity.status(HttpStatus.FOUND)
                .body(ApiResponse.success(
                        departmentService.getAllDepartments(pageable),"Hospital Departments :"
                ));
    }
}
