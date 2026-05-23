package com.medsecure.security;

import com.medsecure.user.AppUser;
import com.medsecure.common.type.AuthProviderType;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class AuthUtil {
    @Value("${jwt.secretKey}")
    private String jwtSecretKey;

    public SecretKey getSecretKey(){
        return Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(AppUser user){
        return Jwts.builder()
                .subject(user.getUsername())
                .claim("userId",user.getId().toString())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+1000*60*10))
                .signWith(getSecretKey())
                .compact();
    }

    public String getUsernameByToken(String token) {
        return Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public AuthProviderType getProviderTypeFromRegistrationId(String registrationId){
        return switch (registrationId.toLowerCase()){
            case "google" -> AuthProviderType.GOOGLE;
            case "facebook" -> AuthProviderType.FACEBOOK;
            case "github" -> AuthProviderType.GITHUB;
            default -> throw new IllegalArgumentException("Unsupported Illegal Arguement Exception");
        };
        }

    public String getProviderId(String registrationId, OAuth2User user){
        String providerId = switch(registrationId.toLowerCase()){
            case "google"->user.getAttribute("sub");
            case "github"->user.getAttribute("id").toString();
            default -> throw new IllegalArgumentException("Illegal Provider "+registrationId);
        };
        if(providerId==null||providerId.isBlank()){
            throw new IllegalArgumentException("Cannot determine the provider id");
        }
        return providerId;
    }

    public String determineUsernameFromOAuth2User(OAuth2User oAuth2User, String registrationId,String providerId){
        String email = oAuth2User.getAttribute("email");
        if(email!=null&&!email.isBlank()){return email;}
        String username = switch (registrationId.toLowerCase()){
            case "google"-> oAuth2User.getAttribute("sub").toString();
            case "github"-> oAuth2User.getAttribute("login").toString();
            default -> providerId;
        };
        return username;
    }
    }

