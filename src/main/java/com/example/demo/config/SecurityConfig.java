package com.example.demo.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
//                        hasAuthority("QUAN_LY")
                        .requestMatchers("/", "/register", "/error", "/api/v1/auth/**").permitAll()
                        .requestMatchers( "/employee", "/dashboard").permitAll()
                        .requestMatchers("/api/v1/customers/**", "/customers").permitAll()
                        .requestMatchers("/home", "/bookings").permitAll()
                        .requestMatchers("/api/v1/auth/authenticate").permitAll() // Chỉ cần một lần, sửa trùng lặp
                        .requestMatchers("/api/v1/rooms/**").permitAll()
                        .requestMatchers("/api/v1/roomType/**").permitAll() // Đảm bảo khớp với endpoint
                        .requestMatchers("/api/bookings/**").permitAll()
                        .requestMatchers("/api/Service/**").permitAll()
                        .requestMatchers("/api/v1/invoices/**").permitAll()
                        .requestMatchers("/api/booking-services").permitAll()
                                .requestMatchers("/api/v1/employees/me").authenticated()
                                .requestMatchers("/api/v1/employees/**").permitAll()
                                .requestMatchers("/api/v1/roomType/getall", "/api/v1/rooms/search").permitAll() // Đảm bảo đúng đường dẫn
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("Unauthorized");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.getWriter().write("Forbidden: Bạn không có quyền truy cập.");
                        })
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Frontend origin
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true); // Nếu dùng cookie hoặc header authorization
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}