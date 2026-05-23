package com.medsecure.security;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SpringSecurityAuditorAware implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        if(SecurityContextHolder.getContext()==null){
            return Optional.of("SYSTEM");
        }
        return Optional.of(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName()
        );
    }
}
