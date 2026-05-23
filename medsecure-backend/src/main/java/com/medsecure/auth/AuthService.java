package com.medsecure.auth;

import com.medsecure.auth.dto.*;
import com.medsecure.user.AppUser;
import com.medsecure.common.type.AuthProviderType;
import com.medsecure.user.UserRepository;
import com.medsecure.security.AuthUtil;
import com.medsecure.security.JwtService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthUtil authUtil;
    private final AuthenticationManager authenticationManager;
    private final ModelMapper modelMapper;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public LoginResponseDto login(LoginRequestDto loginRequestDto, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getUsername()
                        ,loginRequestDto.getPassword())
        );
        AppUser user = (AppUser) authentication.getPrincipal();
        String accessToken = authUtil.generateAccessToken(user);
        String refreshToken = authUtil.generateRefreshToken(user);
        Cookie cookie = new Cookie("refreshToken",refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(cookie);

        return new LoginResponseDto(accessToken,user.getId());
    }

//    public AppUser signupUser(LoginRequestDto loginRequestDto) {
//        AppUser user = userRepository.findByUsername(loginRequestDto.getUsername()).orElse(null);
//        if(user!=null){
//            throw  new IllegalArgumentException("user already exists");
//        }
//        return userRepository.save(AppUser.builder()
//                .username(loginRequestDto.getUsername())
//                .password(passwordEncoder.encode(loginRequestDto.getPassword()))
//                .build());
//    }

    public SignUpResponseDto signup(SignUpRequestDto signUpRequestDto) {
        AppUser user = jwtService.signupUser(signUpRequestDto,null,AuthProviderType.EMAIL);
        userRepository.save(user);
        return modelMapper.map(user,SignUpResponseDto.class);
    }

    public UserResponseDto getMyUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(auth);
        System.out.println(auth.getName());
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found!!"));
        return UserResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .roles(user.getRoles().stream()
                        .map(
                                Enum::name
                        ).collect(Collectors.toSet()))
                .build();
    }
}

