package com.example.demo.model.response;

import lombok.Data;

@Data
public class LogoutResponse {
    private String message;
    private boolean success;

    public LogoutResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }
}