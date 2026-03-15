package com.medsecure.department;

import lombok.Data;

@Data
public class NewDepartmentRequestDto {
    private String departmentName;
    private Long headDoctorId;
}
