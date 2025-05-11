package com.example.demo.service;

import com.example.demo.auth.AuthenticationResponse;
import com.example.demo.auth.RegisterRequest;

public interface AuthService {
    AuthenticationResponse register(RegisterRequest request);
}
