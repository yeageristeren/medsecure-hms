package com.medsecure.security;

import com.medsecure.common.type.PermissionType;
import com.medsecure.common.type.RoleType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static com.medsecure.common.type.PermissionType.*;
import static com.medsecure.common.type.RoleType.*;


public class RolePermissionMapping {
    private static final Map<RoleType,Set<PermissionType>> permission = Map.of
            (PATIENT,Set.of(PATIENT_READ,APPOINTMENT_READ,APPOINTMENT_WRITE),
                    DOCTOR,Set.of(APPOINTMENT_DELETE,APPOINTMENT_WRITE,APPOINTMENT_READ,PATIENT_READ),
                    ADMIN,Set.of(APPOINTMENT_DELETE,APPOINTMENT_WRITE,APPOINTMENT_READ
                            ,PATIENT_READ,PATIENT_WRITE,USER_MANAGE,REPORT_VIEW));

    public static Set<SimpleGrantedAuthority> getAuthoritiesForRole(RoleType role){
        return permission.get(role).stream()
                .map(perm -> new SimpleGrantedAuthority(perm.getPermission()))
                .collect(Collectors.toSet());
    }
}
