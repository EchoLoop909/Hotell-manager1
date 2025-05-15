package com.example.demo.auth;

import com.example.demo.config.JwtService;
import com.example.demo.model.entity.RefreshToken;
import com.example.demo.model.entity.Role;
import com.example.demo.model.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.refreshTokenRepository;
import com.example.demo.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class AuthenticationService {

    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    private final refreshTokenRepository refreshTokenRepository;

//    public AuthenticationResponse register(RegisterRequest request) {
//        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
//        if (userOptional.isPresent()) {
//            throw new RuntimeException("Email already exists");
//        }
//
//        User user = User.builder()
//                .firstname(request.getFirstname())
//                .lastname(request.getLastname())
//                .email(request.getEmail())
//                .password(passwordEncoder.encode(request.getPassword()))
//                .role(Role.ADMIN)//chinh role
//                .build();
//
//        userRepository.save(user);
//
//        String accessToken = jwtService.generateToken(user);
//        String refreshToken = jwtService.generateRefreshToken(user);
//
////        String jwtToken = jwtService.generateToken(user);
//        return AuthenticationResponse.builder()
//                .accessToken(accessToken)
//                .refreshToken(refreshToken)
//                .build();
//    }
public AuthenticationResponse register(RegisterRequest request) {
    Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
    if (userOptional.isPresent()) {
        throw new IllegalArgumentException("Email already exists");
    }

    User user = User.builder()
            .firstname(request.getFirstname())
            .lastname(request.getLastname())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(Role.ADMIN)
            .build();

    userRepository.save(user);

    String accessToken = jwtService.generateToken(user);
    String refreshToken = jwtService.generateRefreshToken(user);

    return AuthenticationResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .firstname(user.getFirstname())
            .lastname(user.getLastname())
            .role(user.getRole().name())
            .build();
}

//    public AuthenticationResponse authenticate(AuthenticationRequest request) {
//        authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(
//                        request.getEmail(),
//                        request.getPassword()
//                )
//        );
//
//        // Lấy thông tin người dùng từ cơ sở dữ liệu
//        var user = userRepository.findByEmail(request.getEmail())
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//        // Tạo access token và refresh token
//        var accessToken = jwtService.generateToken((UserDetails) user);
//        var refreshToken = jwtService.generateRefreshToken((UserDetails) user);
//
//        // Lưu refresh token vào cơ sở dữ liệu
//        RefreshToken token = new RefreshToken();
//        token.setToken(refreshToken);
//        token.setUser(user);
//        token.setExpiryDate(Instant.now().plus(7, ChronoUnit.DAYS));  // Đặt thời gian hết hạn cho refresh token
//        token.setRevoked(false);  // Đảm bảo rằng token không bị hủy
//
//        // Lưu token vào bảng refreshToken trong cơ sở dữ liệu
//        refreshTokenRepository.save(token);
//
//        // Trả về AuthenticationResponse
//        return AuthenticationResponse.builder()
//                .accessToken(accessToken)
//                .refreshToken(refreshToken)
//                .firstname(user.getFirstname())
//                .lastname(user.getLastname())
//                .role(user.getRole().name())
//                .build();
//    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        var accessToken = jwtService.generateToken((UserDetails) user);
        var refreshToken = jwtService.generateRefreshToken((UserDetails) user);

        RefreshToken token = new RefreshToken();
        token.setToken(refreshToken);
        token.setUser(user);
        token.setExpiryDate(Instant.now().plus(7, ChronoUnit.DAYS));
        token.setRevoked(false);

        refreshTokenRepository.save(token);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .role(user.getRole().name())
                .build();
    }

//    public void deleteToken(String refreshToken) {
//        Optional<RefreshToken> tokenOptional = refreshTokenRepository.findByToken(refreshToken);
//        if (tokenOptional.isPresent()) {
//            // Xóa token khỏi cơ sở dữ liệu
//            refreshTokenRepository.delete(tokenOptional.get());
//        } else {
//            throw new RuntimeException("Refresh token not found");
//        }
//    }
public void deleteToken(String refreshToken) {
    if (refreshToken == null || refreshToken.trim().isEmpty()) {
        throw new IllegalArgumentException("Refresh token cannot be null or empty");
    }

    Optional<RefreshToken> tokenOptional = refreshTokenRepository.findByToken(refreshToken);
    if (tokenOptional.isPresent()) {
        refreshTokenRepository.delete(tokenOptional.get());
    } else {
        throw new UsernameNotFoundException("Refresh token not found");
    }
}
}
