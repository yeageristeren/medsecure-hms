package com.medsecure.patient;

import com.medsecure.common.exception.ResourceNotFoundException;
import com.medsecure.patient.dto.PatientResponseDto;
import com.medsecure.user.AppUser;
import com.medsecure.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    @Transactional
    public PatientResponseDto getPatientById(Long patientId) {
        Patient patient = patientRepository.findById(patientId).orElseThrow(() -> new ResourceNotFoundException("Patient Not " +
                "Found with id: " + patientId));
        return modelMapper.map(patient, PatientResponseDto.class);
    }

    @Transactional
    public PatientResponseDto getPatientByUsername(String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found!!"));
        Patient patient = patientRepository.findById(user.getId())
                .orElseThrow();
        return modelMapper.map(patient, PatientResponseDto.class);
    }

    public Page<PatientResponseDto> getAllPatients(Integer pageNumber, Integer pageSize) {
        return patientRepository.findAllPatients(PageRequest.of(pageNumber, pageSize))
                .map(patient -> modelMapper.map(patient, PatientResponseDto.class));
    }
}
