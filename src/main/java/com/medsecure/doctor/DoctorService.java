package com.medsecure.doctor;

import com.medsecure.common.exception.ResourceNotFoundException;
import com.medsecure.department.Department;
import com.medsecure.department.DepartmentRepository;
import com.medsecure.doctor.dto.DoctorResponseDto;
import com.medsecure.user.AppUser;
import com.medsecure.doctor.dto.DoctorRequestDto;
import com.medsecure.common.type.RoleType;
import com.medsecure.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    public Page<DoctorResponseDto> getAllDoctors(Pageable pageable) {
        return doctorRepository.findAll(pageable)
                .map(doctor ->
                    DoctorResponseDto.builder()
                            .id(doctor.getId())
                            .name(doctor.getName())
                            .specialization(doctor.getSpecialization())
                            .email(doctor.getEmail())
                            .build()
                );
    }

    @Transactional
    public DoctorResponseDto onBoardNewDoctor(DoctorRequestDto doctorRequestDto) {
        AppUser user = userRepository.findById(doctorRequestDto.getId()).orElseThrow();
        if(doctorRepository.findById(user.getId()).orElse(null)!=null){
            throw new BadCredentialsException("Doctor already exists with id : "
                    +doctorRequestDto.getId().toString());
          }
        Doctor doctor = Doctor.builder()
                .name(doctorRequestDto.getName())
                .email(doctorRequestDto.getEmail())
                .deleted(false)
                .specialization(doctorRequestDto.getSpecialization())
                .build();
        doctor.setUser(user);
        user.getRoles().add(RoleType.DOCTOR);
        doctorRepository.save(doctor);
        return modelMapper.map(doctor, DoctorResponseDto.class);
    }

    public Page<DoctorResponseDto> findAvailBySpec(String specialisation, Pageable pageable) {
        Page<Doctor> doctors = doctorRepository.findBySpecializationAndDeleted(specialisation,false,pageable);
        return doctors.map(doctor -> DoctorResponseDto.builder()
                .email(doctor.getEmail())
                .id(doctor.getId())
                .name(doctor.getName())
                .specialization(doctor.getSpecialization())
                .build());
    }

    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id).orElseThrow(
                ()->new ResourceNotFoundException("Doctor not found with id :"+id.toString())
        );
        doctorRepository.delete(doctor);
    }

    @Transactional
    public void addDoctorToDepartment(Long doctorId, Long departmentId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department does not exist"));
        department.getDoctors().add(doctor);
        doctor.getDepartments().add(department);
    }
}
