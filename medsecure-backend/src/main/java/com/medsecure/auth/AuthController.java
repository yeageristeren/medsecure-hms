package com.medsecure.auth;

import com.medsecure.auth.dto.*;
import com.medsecure.common.response.ApiResponse;
import com.medsecure.security.AuthUtil;
import com.medsecure.user.AppUser;
import com.medsecure.user.UserRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
@Tag(name = "Authorisation APIs",description = "Login and SignUp APIs")
public class AuthController {

    private final AuthService authService;
    private final AuthUtil authUtil;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto,
                                                    HttpServletResponse response){
        return ResponseEntity.ok(authService.login(loginRequestDto,response));
    }
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request){
        Cookie[] cookies = request.getCookies();
        System.out.println("Cookies: " + Arrays.toString(request.getCookies()));
        String refreshToken = null;
        for(Cookie cookie:cookies){
            if(cookie.getName().equals("refreshToken")){
                refreshToken = cookie.getValue();
            }
        }
        if (refreshToken==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String username = authUtil.getUsernameByToken(refreshToken);
        AppUser user = userRepository.getAppUserByUsername(username).orElseThrow();
        return ResponseEntity.ok(new LoginResponseDto(authUtil.generateAccessToken(user),user.getId()));
    }
    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDto> signup(@RequestBody SignUpRequestDto signUpRequestDto){
        return ResponseEntity.ok(authService.signup(signUpRequestDto));
    }
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponseDto>> getMyUser(){
        UserResponseDto dto = authService.getMyUser();
        return ResponseEntity.ok(ApiResponse.success(dto,"Current user details!"));
    }
}
