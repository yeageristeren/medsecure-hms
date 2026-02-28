package com.medsecure.appointment;

import com.medsecure.appointment.dto.AppointmentResponseDto;
import com.medsecure.appointment.dto.CreateAppointmentRequestDto;
import com.medsecure.appointment.dto.UpdateAppointmentStatusRequest;
import com.medsecure.common.exception.BusinessException;
import com.medsecure.common.exception.ResourceNotFoundException;
import com.medsecure.common.type.AppointmentStatus;
import com.medsecure.doctor.Doctor;
import com.medsecure.doctor.dto.DoctorResponseDto;
import com.medsecure.patient.Patient;
import com.medsecure.doctor.DoctorRepository;
import com.medsecure.patient.PatientRepository;
import com.medsecure.patient.dto.PatientResponseDto;
import com.medsecure.user.AppUser;
import com.medsecure.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    @Transactional
    public AppointmentResponseDto createNewAppointment(CreateAppointmentRequestDto createAppointmentRequestDto) {
        Long doctorId = createAppointmentRequestDto.getDoctorId();
        Long patientId = createAppointmentRequestDto.getPatientId();

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + patientId));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + doctorId));
        Appointment appointment = Appointment.builder()
                .reason(createAppointmentRequestDto.getReason())
                .appointmentTime(createAppointmentRequestDto.getAppointmentTime())
                .status(AppointmentStatus.PENDING)
                .build();

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        slotAvailabilityCheck(appointment);


        patient.getAppointments().add(appointment);
        doctor.getAppointments().add(appointment);// to maintain consistency


        appointment = appointmentRepository.save(appointment);
        return modelMapper.map(appointment, AppointmentResponseDto.class);
    }

    private void slotAvailabilityCheck(Appointment appointment) {
        if(appointment.getAppointmentTime().getMinute()%30!=0){
            throw new BusinessException("Appointments can be booked in 30 minutes interval only");
        }

        boolean conflict = appointmentRepository.existsByAppointmentTimeAndDoctor_IdAndStatusIn
                (appointment.getAppointmentTime(),appointment.getDoctor().getId()
                        ,List.of(AppointmentStatus.PENDING,AppointmentStatus.CONFIRMED));
        if(conflict){
            throw  new BusinessException("This time slot is already booked");
        }
    }

    @Transactional
    public Appointment reAssignAppointmentToAnotherDoctor(Long appointmentId, Long doctorId) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow();
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow();

        appointment.setDoctor(doctor); // this will automatically call the update, because it is dirty

        doctor.getAppointments().add(appointment); // just for bidirectional consistency

        return appointment;
    }

    public Page<AppointmentResponseDto> getAllAppointmentsOfDoctor(String userName, Pageable pageable) {
        AppUser user = userRepository.findAppUserByUsername(userName);
        Long doctorId = user.getId();
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow();
        return appointmentRepository.getAppointmentsByDoctor_Id(doctorId,pageable)
                .map(appointment -> modelMapper.map(appointment, AppointmentResponseDto.class));
    }

    public Page<AppointmentResponseDto> getAllAppointments(Pageable pageable) {
        Page<Appointment> appointments = appointmentRepository.findAll(pageable);
        return appointments.map(app -> AppointmentResponseDto.builder()
                .id(app.getId())
                .doctor(modelMapper.map(app.getDoctor(), DoctorResponseDto.class))
                .patient(modelMapper.map(app.getPatient(), PatientResponseDto.class))
                .reason(app.getReason())
                .appointmentTime(app.getAppointmentTime())
                .build());
    }

    @Transactional
    public void updateAppointmentStatus(Long appointmentId,
                                        UpdateAppointmentStatusRequest newStatus) throws AccessDeniedException {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(()-> new EntityNotFoundException
                ("Appointment not found with id {}"+appointmentId));



        //validate ownership
        if(!Objects.equals(appointment.getDoctor().getUser().getUsername(), SecurityContextHolder.getContext().getAuthentication()
                .getName())){
            throw new AccessDeniedException("You are not allowed to access this appointment");
        }
        validateTransition(appointment.getStatus(),newStatus.status());
        appointment.setStatus(newStatus.status());
    }

    private void validateTransition(AppointmentStatus current, AppointmentStatus target) {

        if(current == AppointmentStatus.CANCELLED
        || current == AppointmentStatus.COMPLETED
        || current == AppointmentStatus.REJECTED){
            throw new BusinessException("Appointment is already closed");
        }
        if(target == AppointmentStatus.COMPLETED &&
            current != AppointmentStatus.CONFIRMED){
            throw new BusinessException("Only confirmed appointments can be completed");
        }
        if(target == AppointmentStatus.CONFIRMED &&
            current != AppointmentStatus.PENDING){
            throw new BusinessException("Only pending appointments can be confirmed");
        }
        if(target == AppointmentStatus.REJECTED &&
        current != AppointmentStatus.PENDING){
            throw new BusinessException("Only pending appointments can be rejected");
        }
    }

    @Transactional
    public void cancelAppointment(Long id) throws AccessDeniedException {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Appointment not found"));
        if(!Objects.equals(appointment.getPatient().getUser().getUsername(), SecurityContextHolder.getContext().getAuthentication().getName())){
            throw new AccessDeniedException("Cannot cancel other patient's appointment with id "+id.toString());
        }
        if(appointment.getStatus() == AppointmentStatus.COMPLETED){
            throw new BusinessException("Completed Appointments cannot be cancelled");
        }
        appointment.setStatus(AppointmentStatus.CANCELLED);
    }
}
