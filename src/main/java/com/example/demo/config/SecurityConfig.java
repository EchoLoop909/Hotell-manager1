package com.example.demo.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/register", "/error", "/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/employees/**", "/employee", "/dashboard").hasAuthority("QUAN_LY")
                        .requestMatchers("/api/v1/customers/**", "/customers").permitAll()
                        .requestMatchers("/home", "/bookings").hasAnyAuthority("QUAN_LY", "LE_TAN")
                        .requestMatchers("/api/v1/auth/authenticate", "/api/v1/auth/authenticate").permitAll()
                        .requestMatchers("//api/v1/rooms/**").hasAnyAuthority("QUAN_LY")
                        .requestMatchers("/api/v1/roomType/**").hasAnyAuthority("QUAN_LY")
                        .requestMatchers("/api/bookings/**").permitAll()
                        .requestMatchers("/api/Service/**").hasAuthority("QUAN_LY")
                        .requestMatchers("/api/booking-services").permitAll()
                        .anyRequest().authenticated()
                )
//                .exceptionHandling(exception -> exception
//                        .authenticationEntryPoint((request, response, authException) -> response.sendRedirect("/login"))
//                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("Unauthorized");
                        })
                )

                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}