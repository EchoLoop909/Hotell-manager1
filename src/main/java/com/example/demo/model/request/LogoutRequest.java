package com.example.demo.model.request;
import lombok.Data;

@Data
public class LogoutRequest {
    private String refreshToken;
}