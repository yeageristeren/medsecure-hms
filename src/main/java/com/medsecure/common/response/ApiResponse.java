package com.medsecure.common.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timeStamp;

    public static <T> ApiResponse<T> success(T data,String msg){
        return ApiResponse.<T>builder()
                .success(true)
                .timeStamp(LocalDateTime.now())
                .message(msg)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> failure(T data,String msg){
        return ApiResponse.<T>builder()
                .success(false)
                .timeStamp(LocalDateTime.now())
                .message(msg)
                .build();
    }
}
