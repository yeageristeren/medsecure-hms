package com.medsecure.admin;

import com.medsecure.appointment.AppointmentRepository;
import com.medsecure.common.dto.AppointmentStatusStatsDto;
import com.medsecure.common.dto.Dashboard;
import com.medsecure.common.dto.SystemStatsDto;
import com.medsecure.doctor.DoctorRepository;
import com.medsecure.patient.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {


    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public SystemStatsDto getSystemStats() {

        Long totalDoctors = doctorRepository.count();
        Long totalPatients = patientRepository.count();
        Long totalAppointments = appointmentRepository.count();

        LocalDate today = LocalDate.now();
        //today appointments
        Long todayAppointments = appointmentRepository.countAppointmentByAppointmentTimeBetween(
                today.atStartOfDay(),today.atTime(LocalTime.MAX)
        );
        //weekly appointments
        Long weeklyAppointments = appointmentRepository.countAppointmentByAppointmentTimeBetween(
                today.with(DayOfWeek.MONDAY).atStartOfDay()
                ,today.with(DayOfWeek.FRIDAY).atTime(LocalTime.MAX)
        );
        //monthly appointments
        Long monthlyAppointments = appointmentRepository.countAppointmentByAppointmentTimeBetween(
                today.withDayOfMonth(1).atStartOfDay()
                ,today.withDayOfMonth(today.lengthOfMonth()).atTime(LocalTime.MAX)
        );

        return new SystemStatsDto(totalDoctors,totalPatients,totalAppointments
                ,todayAppointments,weeklyAppointments,monthlyAppointments);
    }

    public AppointmentStatusStatsDto getAppointmentStats() {
        List<Object[]> stats = appointmentRepository.getAppointmentStats();
        Long pending=0L,completed=0L,rejected=0L,confirmed=0L,cancelled = 0L;
        for(Object[] obj : stats){
            String status = (String)obj[0];
            Long count = ((Number)obj[1]).longValue();
            switch (status.toLowerCase()){
                case "pending" -> pending = count;
                case "confirmed" -> confirmed = count;
                case "completed" -> completed = count;
                case "rejected" -> rejected = count;
                case "cancelled" -> cancelled = count;
            }
        }
        return new AppointmentStatusStatsDto(pending, confirmed, completed, cancelled, rejected);
    }
}
