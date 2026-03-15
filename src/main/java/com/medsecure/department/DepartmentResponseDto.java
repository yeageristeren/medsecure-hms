package com.medsecure.department;

import com.medsecure.doctor.Doctor;
import lombok.*;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentResponseDto {
    private Long id;
    private String name;
    private Long headDoctorId;
}
