package com.medsecure.security;

import com.medsecure.user.AppUser;
import com.medsecure.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {


    private final AuthUtil authUtil;
    private final UserRepository userRepository;
    private final HandlerExceptionResolver handlerExceptionResolver;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try{
            log.info("incoming request : {}",request.getRequestURI());
            final String requestTokenHeader = request.getHeader("Authorization");
            if(requestTokenHeader==null||!requestTokenHeader.startsWith("Bearer ")){
                filterChain.doFilter(request,response);
                return;
            }
            String token = requestTokenHeader.split("Bearer ")[1];
            String username = authUtil.getUsernameByToken(token);

            if(username!=null && SecurityContextHolder.getContext().getAuthentication()==null){
                AppUser user = userRepository.findByUsername(username).orElseThrow();
                SecurityContextHolder.getContext().setAuthentication
                        (new UsernamePasswordAuthenticationToken(user,null,user.getAuthorities()));

            }
            filterChain.doFilter(request,response);
        } catch (Exception e) {
            handlerExceptionResolver.resolveException(request,response,null,e);
        }
    }
}
