package com.example.demo.auth;

import com.example.demo.config.JwtService;
import com.example.demo.model.entity.Customer;
import com.example.demo.model.entity.Employee;
import com.example.demo.model.request.LogoutRequest;
import com.example.demo.model.response.LogoutResponse;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final JwtService jwtService;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            if (customerRepository.findByEmail(registerRequest.getEmail()).isPresent() ||
                    employeeRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email đã tồn tại");
            }

            authenticationService.register(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body("Đăng ký thành công");
        } catch (Exception e) {
            logger.error("Registration error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Đăng ký thất bại: " + e.getMessage());
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest request) {
        try {
            AuthenticationResponse authResponse = authenticationService.authenticate(request);
            if (authResponse == null || authResponse.getAccessToken() == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Email hoặc mật khẩu không đúng"));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("access_token", authResponse.getAccessToken());
            response.put("refresh_token", authResponse.getRefreshToken());
            response.put("user", Map.of(
                    "name", authResponse.getName(),
                    "role", authResponse.getRole()
            ));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Authentication error: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Đã xảy ra lỗi máy chủ: " + e.getMessage()));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationResponse> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String userEmail = jwtService.extractUsername(refreshToken);
        UserDetails user = customerRepository.findByEmail(userEmail)
                .map(UserDetails.class::cast)
                .orElseGet(() -> employeeRepository.findByEmail(userEmail)
                        .map(UserDetails.class::cast)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found")));

        if (!jwtService.isTokenValid(refreshToken, user)) {
            return ResponseEntity.status(403).build();
        }

        String newAccessToken = jwtService.generateToken(user);
        String name = user instanceof Customer ? ((Customer) user).getName() : ((Employee) user).getName();
        String role = user instanceof Customer ? "CUSTOMER" : ((Employee) user).getEmployeeRole().name();

        return ResponseEntity.ok(
                AuthenticationResponse.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(refreshToken)
                        .name(name)
                        .role(role)
                        .build()
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout(@RequestBody LogoutRequest request) {
        String refreshToken = request.getRefreshToken();
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            logger.warn("Logout attempt with missing or empty refresh token");
            return ResponseEntity.badRequest()
                    .body(new LogoutResponse("Refresh token is required", false));
        }

        try {
            logger.info("Processing logout for refresh token: {}", refreshToken);
            authenticationService.deleteToken(refreshToken);
            logger.info("Logout successful for refresh token: {}", refreshToken);
            return ResponseEntity.ok(new LogoutResponse("Đăng xuất thành công", true));
        } catch (IllegalArgumentException e) {
            logger.error("Logout failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new LogoutResponse(e.getMessage(), false));
        } catch (Exception e) {
            logger.error("Unexpected error during logout: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LogoutResponse("Lỗi máy chủ: " + e.getMessage(), false));
        }
    }
}