package com.example.demo.service;

import com.example.demo.model.entity.RefreshToken;
import com.example.demo.model.entity.User;
import com.example.demo.repository.refreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;
@Service
public class RefreshTokenService {

    @Autowired
    private refreshTokenRepository refreshTokenRepository;

    public RefreshToken createRefreshToken(User user) {
        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setExpiryDate(Instant.now().plus(7, ChronoUnit.DAYS));
        token.setToken(UUID.randomUUID().toString());
        token.setRevoked(false);
        return refreshTokenRepository.save(token);
    }

    public boolean isTokenValid(RefreshToken token) {
        return !token.isRevoked() && token.getExpiryDate().isAfter(Instant.now());
    }

    public void revokeToken(String tokenStr) {
        refreshTokenRepository.findByToken(tokenStr).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    // Hàm này sẽ chạy mỗi ngày lúc 2h sáng và xóa những token đã hết hạn
    @Scheduled(cron = "0 0 2 * * ?") // Giờ Việt Nam có thể thêm timezone nếu cần
    public void deleteExpiredTokens() {
        refreshTokenRepository.deleteByExpiryDateBefore(Instant.now());
    }
}

