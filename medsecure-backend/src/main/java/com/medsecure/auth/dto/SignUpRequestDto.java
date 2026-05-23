package com.medsecure.auth.dto;

import com.medsecure.common.type.RoleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequestDto {
    private String username;
    private String password;
    private String name;

    //for demo version
    private Set<RoleType> roles = new HashSet<>();
}
