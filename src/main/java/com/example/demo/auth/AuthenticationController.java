//package com.example.demo.auth;
//
//
//import com.example.demo.config.JwtService;
//import com.example.demo.model.entity.RefreshToken;
//import com.example.demo.model.entity.User;
//import com.example.demo.repository.UserRepository;
//import com.example.demo.service.RefreshTokenService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/v1/auth")
//@RequiredArgsConstructor
//
//public class AuthenticationController {
//
//    private final AuthenticationService authenticationService;
//
//    private final JwtService jwtService;
//
//    private final UserRepository userRepository;
//
//@PostMapping("/register")
//public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
//    try {
//        Optional<User> user = userRepository.findByEmail(registerRequest.getEmail());
//        if (user.isPresent()) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email đã tồn tại");
//        }
//
//        authenticationService.register(registerRequest);
//        return ResponseEntity.status(HttpStatus.CREATED).body("Đăng ký thành công");
//    } catch (Exception e) {
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Đăng ký thất bại: " + e.getMessage());
//    }
//}
//
//    @PostMapping("/authenticate")
//    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest request) {
//        try {
//            // Kiểm tra người dùng tồn tại theo email
//            var userOptional = userRepository.findByEmail(request.getEmail());
//            if (userOptional.isEmpty()) {
//                return ResponseEntity
//                        .status(HttpStatus.UNAUTHORIZED)
//                        .body(Map.of("message", "Email hoặc mật khẩu không đúng"));
//            }
//
//            var user = userOptional.get();
//
//            // Gửi vào service xác thực
//            AuthenticationResponse authResponse = authenticationService.authenticate(request);
//
//            if (authResponse == null || authResponse.getAccessToken() == null) {
//                return ResponseEntity
//                        .status(HttpStatus.UNAUTHORIZED)
//                        .body(Map.of("message", "Email hoặc mật khẩu không đúng"));
//            }
//
//            // Tạo map trả về gồm access_token và user (chỉ chọn thông tin cần thiết)
//            Map<String, Object> response = new HashMap<>();
//            response.put("access_token", authResponse.getAccessToken());
//            response.put("user", Map.of(
//                    "firstname", user.getFirstname(),
//                    "lastname", user.getLastname(),
//                    "role", user.getRole().name() // Nếu role là enum
//            ));
//
//            return ResponseEntity.ok(response);
//
//        } catch (Exception e) {
//            return ResponseEntity
//                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("message", "Đã xảy ra lỗi máy chủ: " + e.getMessage()));
//        }
//    }
//
//    @PostMapping("/refresh-token")
//    public ResponseEntity<AuthenticationResponse> refreshToken(@RequestBody Map<String, String> request) {
//        String refreshToken = request.get("refreshToken");
//
//        if (refreshToken == null || refreshToken.isEmpty()) {
//            return ResponseEntity.badRequest().build();
//        }
//
//        String userEmail = jwtService.extractUsername(refreshToken);
//        User user = userRepository.findByEmail(userEmail)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//        if (!jwtService.isTokenValid(refreshToken, user)) {
//            return ResponseEntity.status(403).build();
//        }
//
//        String newAccessToken = jwtService.generateToken(user);
//        return ResponseEntity.ok(
//                AuthenticationResponse.builder()
//                        .accessToken(newAccessToken)
//                        .refreshToken(refreshToken) // hoặc tạo cái mới nếu muốn
//                        .build()
//        );
//    }
//
//    @PostMapping("/logout")
//    @ResponseBody
//    public ResponseEntity<?> logout(@RequestBody Map<String, String> body) {
//        String refreshToken = body.get("refreshToken");
//
//        if (refreshToken == null || refreshToken.isEmpty()) {
//            return ResponseEntity.badRequest().body("Refresh token is required");
//        }
//
//        try {
//            // Kiểm tra xem token có hợp lệ hay không
//            String userEmail = jwtService.extractUsername(refreshToken);
//            User user = userRepository.findByEmail(userEmail)
//                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//            if (!jwtService.isTokenValid(refreshToken, user)) {
//                return ResponseEntity.status(403).body("Invalid refresh token");
//            }
//
//            // Xóa refresh token khỏi cơ sở dữ liệu
//            authenticationService.deleteToken(refreshToken);
//            return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(404).body(e.getMessage());
//        }
//    }
//
//}
//
package com.example.demo.auth;

import com.example.demo.config.JwtService;
import com.example.demo.model.entity.User;
import com.example.demo.model.request.LogoutRequest;
import com.example.demo.model.request.LogoutResponse;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            Optional<User> user = userRepository.findByEmail(registerRequest.getEmail());
            if (user.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email đã tồn tại");
            }

            authenticationService.register(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body("Đăng ký thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Đăng ký thất bại: " + e.getMessage());
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest request) {
        try {
            var userOptional = userRepository.findByEmail(request.getEmail());
            if (userOptional.isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Email hoặc mật khẩu không đúng"));
            }

            var user = userOptional.get();
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
                    "firstname", authResponse.getFirstname(),
                    "lastname", authResponse.getLastname(),
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
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!jwtService.isTokenValid(refreshToken, user)) {
            return ResponseEntity.status(403).build();
        }

        String newAccessToken = jwtService.generateToken(user);
        return ResponseEntity.ok(
                AuthenticationResponse.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(refreshToken)
                        .firstname(user.getFirstname())
                        .lastname(user.getLastname())
                        .role(user.getRole().name())
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
            String userEmail = jwtService.extractUsername(refreshToken);
            if (userEmail == null) {
                logger.warn("Invalid refresh token: unable to extract username");
                return ResponseEntity.status(403)
                        .body(new LogoutResponse("Invalid refresh token", false));
            }

            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (!jwtService.isTokenValid(refreshToken, user)) {
                logger.warn("Invalid refresh token for user: {}", userEmail);
                return ResponseEntity.status(403)
                        .body(new LogoutResponse("Invalid refresh token", false));
            }

            authenticationService.deleteToken(refreshToken);
            logger.info("User {} logged out successfully", userEmail);
            return ResponseEntity.ok(new LogoutResponse("Đăng xuất thành công", true));

        } catch (UsernameNotFoundException e) {
            logger.error("Logout failed: {}", e.getMessage());
            return ResponseEntity.status(404)
                    .body(new LogoutResponse(e.getMessage(), false));
        } catch (Exception e) {
            logger.error("Unexpected error during logout: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                    .body(new LogoutResponse("Lỗi máy chủ", false));
        }
    }
}