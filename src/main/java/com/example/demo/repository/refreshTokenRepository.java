package com.example.demo.repository;

import com.example.demo.model.entity.RefreshToken;
import com.example.demo.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface refreshTokenRepository extends JpaRepository<RefreshToken, Long> {  // Chỉnh sửa đây
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
    void deleteByExpiryDateBefore(Instant now);


}
