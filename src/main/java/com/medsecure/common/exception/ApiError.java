package com.medsecure.common.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiError {
    private boolean success;
    private String error;
    private LocalDateTime timeStamp;
    private HttpStatus statusCode;


}
