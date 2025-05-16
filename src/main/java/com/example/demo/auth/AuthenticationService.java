package com.example.demo.auth;

import com.example.demo.config.JwtService;
import com.example.demo.model.entity.Customer;
import com.example.demo.model.entity.Employee;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private final PasswordEncoder passwordEncoder;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        logger.info("Registering user with email: {}", request.getEmail());
        if (customerRepository.findByEmail(request.getEmail()).isPresent() ||
                employeeRepository.findByEmail(request.getEmail()).isPresent()) {
            logger.warn("Email already exists: {}", request.getEmail());
            throw new IllegalArgumentException("Email already exists");
        }

        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));

        customerRepository.save(customer);
        logger.info("Saved customer: {}", customer.getEmail());

        String accessToken = jwtService.generateToken(customer);
        String refreshToken = UUID.randomUUID().toString();
        customer.setRefreshToken(refreshToken);
        customer.setRefreshTokenExpiry(LocalDateTime.now().plusDays(7));
        customerRepository.save(customer);
        logger.info("Saved refresh token for customer: {}", customer.getEmail());

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .name(customer.getName())
                .role("CUSTOMER")
                .build();
    }

    @Transactional
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        logger.info("Authenticating user with email: {}", request.getEmail());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            logger.error("Authentication failed for email: {}. Error: {}", request.getEmail(), e.getMessage());
            throw new IllegalArgumentException("Invalid email or password");
        }

        UserDetails user = customerRepository.findByEmail(request.getEmail())
                .map(UserDetails.class::cast)
                .orElseGet(() -> employeeRepository.findByEmail(request.getEmail())
                        .map(UserDetails.class::cast)
                        .orElseThrow(() -> {
                            logger.error("User not found: {}", request.getEmail());
                            return new UsernameNotFoundException("User not found");
                        }));

        String accessToken = jwtService.generateToken(user);
        String refreshToken = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusDays(7);

        String name;
        String role;
        if (user instanceof Customer customer) {
            logger.info("Found customer: {}", customer.getEmail());
            customer.setRefreshToken(refreshToken);
            customer.setRefreshTokenExpiry(expiry);
            try {
                customerRepository.save(customer);
                logger.info("Saved refresh token for customer: {}", customer.getEmail());
            } catch (Exception e) {
                logger.error("Failed to save refresh token for customer: {}. Error: {}", customer.getEmail(), e.getMessage());
                throw new RuntimeException("Failed to save refresh token", e);
            }
            name = customer.getName();
            role = "CUSTOMER";
        } else if (user instanceof Employee employee) {
            logger.info("Found employee: {}", employee.getEmail());
            employee.setRefreshToken(refreshToken);
            employee.setRefreshTokenExpiry(expiry);
            try {
                employeeRepository.save(employee);
                logger.info("Saved refresh token for employee: {}", employee.getEmail());
            } catch (Exception e) {
                logger.error("Failed to save refresh token for employee: {}. Error: {}", employee.getEmail(), e.getMessage());
                throw new RuntimeException("Failed to save refresh token", e);
            }
            name = employee.getName();
            role = employee.getEmployeeRole().name();
        } else {
            logger.error("Unknown user type for email: {}", request.getEmail());
            throw new IllegalStateException("Unknown user type");
        }

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .name(name)
                .role(role)
                .build();
    }

    @Transactional
    public void deleteToken(String refreshToken) {
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            logger.warn("Attempt to delete null or empty refresh token");
            throw new IllegalArgumentException("Refresh token cannot be null or empty");
        }

        logger.info("Attempting to delete refresh token: {}", refreshToken);

        boolean tokenDeleted = false;

        Optional<Customer> customer = customerRepository.findByRefreshToken(refreshToken);
        if (customer.isPresent()) {
            Customer c = customer.get();
            logger.info("Found customer with refresh token: {}", c.getEmail());
            c.setRefreshToken(null);
            c.setRefreshTokenExpiry(null);
            try {
                customerRepository.save(c);
                logger.info("Successfully deleted refresh token for customer: {}", c.getEmail());
                tokenDeleted = true;
            } catch (Exception e) {
                logger.error("Failed to save customer after clearing refresh token: {}. Error: {}", c.getEmail(), e.getMessage());
                throw new RuntimeException("Failed to clear refresh token", e);
            }
        }

        Optional<Employee> employee = employeeRepository.findByRefreshToken(refreshToken);
        if (employee.isPresent()) {
            Employee e = employee.get();
            logger.info("Found employee with refresh token: {}", e.getEmail());
            e.setRefreshToken(null);
            e.setRefreshTokenExpiry(null);
            try {
                employeeRepository.save(e);
                logger.info("Successfully deleted refresh token for employee: {}", e.getEmail());
                tokenDeleted = true;
            } catch (Exception e1) {
                logger.error("Failed to save employee after clearing refresh token: {}. Error: {}");
                throw new RuntimeException("Failed to clear refresh token", e1);
            }
        }

        if (!tokenDeleted) {
            logger.warn("Refresh token not found in database: {}", refreshToken);
            throw new IllegalArgumentException("Refresh token not found in database");
        }
    }
}