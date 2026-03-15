package com.medsecure.department;

import com.medsecure.common.exception.BusinessException;
import com.medsecure.doctor.Doctor;
import com.medsecure.doctor.DoctorRepository;
import com.medsecure.doctor.dto.DoctorResponseDto;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public DepartmentResponseDto addNewDepartment(NewDepartmentRequestDto dto){
        if(departmentRepository.existsByName(dto.getDepartmentName())){
            throw new BusinessException("Department already exists.");
        }
        Doctor head = doctorRepository.findById(dto.getHeadDoctorId()).orElse(null);
        if(head == null){
            throw new EntityNotFoundException("Head Doctor Credentials not found");
        }
        Department department = Department.builder()
                .name(dto.getDepartmentName())
                .headDoctor(head)
                .doctors(new HashSet<>(Set.of(head)))
                .build();
        head.getDepartments().add(department);
        departmentRepository.save(department);
        return modelMapper.map(department,DepartmentResponseDto.class);
    }

    public Page<DepartmentResponseDto> getAllDepartments(Pageable pageable) {
        Page<Department> departments = departmentRepository.findAll(pageable);
        return departments.map(department -> {
            DepartmentResponseDto dto = DepartmentResponseDto.builder()
                    .id(department.getId())
                    .headDoctorId(department.getHeadDoctor().getId())
                    .name(department.getName())
                    .build();
            return dto;
        });
    }
}
