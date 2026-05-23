package com.medsecure.user;

import com.medsecure.common.type.AuthProviderType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByUsername(String username);

    Optional<AppUser> findByProviderIdAndProviderType(String providerId, AuthProviderType providerType);

    AppUser findAppUserByUsername(String userName);
}