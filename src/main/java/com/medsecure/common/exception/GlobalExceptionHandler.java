package com.medsecure.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiError> handleUsernameNotFoundException(Exception e){
        ApiError apiError = new ApiError(false,"Username not found :"+e.getMessage(),LocalDateTime.now(), HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(apiError,apiError.getStatusCode());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> accessDeniedException(Exception e){
        ApiError apiError = new ApiError(false,"User is not allowed :"+e.getMessage(), LocalDateTime.now(), HttpStatus.FORBIDDEN);
        return new ResponseEntity<>(apiError,apiError.getStatusCode());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFound(Exception e){
        ApiError apiError = new ApiError(false,"Resource not found :"+e.getMessage(), LocalDateTime.now(), HttpStatus.NOT_FOUND);
        return ResponseEntity.status(apiError.getStatusCode()).body(apiError);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiError> handleBusinessExcepiton(Exception e){
        ApiError apiError = new ApiError(false, "Business Error :"+e.getMessage(),LocalDateTime.now(), HttpStatus.BAD_REQUEST);
        return ResponseEntity.status(apiError.getStatusCode()).body(apiError);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleException(Exception e){
        ApiError apiError = new ApiError(false,"User is not allowed "+e.getMessage(),LocalDateTime.now(), HttpStatus.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(apiError,apiError.getStatusCode());
    }
}
