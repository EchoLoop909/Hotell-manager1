package com.example.demo.service.impl;

import com.example.demo.model.EmployeeDto;
import com.example.demo.model.entity.Employee;
import com.example.demo.model.response.ApiResponse;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeServiceImpl.class);

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ResponseEntity<?> createEmployee(EmployeeDto dto) {
        logger.info("Tạo nhân viên: {}", dto.getEmail());

        // Kiểm tra email đã tồn tại
        Optional<Employee> existing = employeeRepository.findByEmail(dto.getEmail());
        if (existing.isPresent()) {
            logger.warn("Email đã tồn tại: {}", dto.getEmail());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email da ton tai");
        }

        try {
            // Map DTO -> Entity
            Employee emp = new Employee();
            emp.setEmail(dto.getEmail());
            emp.setName(dto.getName());
            emp.setPassword(passwordEncoder.encode(dto.getPassword()));

            // Xử lý role
            if (dto.getEmployeeRole() == null) {
                throw new IllegalArgumentException("Employee role must not be null");
            }
            String normalizedRole = dto.getEmployeeRole().trim().toUpperCase().replace(" ", "_");

            emp.setEmployeeRole(Employee.EmployeeRole.valueOf(normalizedRole));

            // Lưu nhân viên
            Employee savedEmployee = employeeRepository.save(emp);
            logger.info("Nhân viên đã được tạo: {}", savedEmployee.getEmail());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nhân viên đã được tạo");

        } catch (IllegalArgumentException e) {
            logger.error("Vai trò không hợp lệ: {}", dto.getEmployeeRole(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vai trò không hợp lệ");
        } catch (Exception e) {
            logger.error("Lỗi không mong muốn: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lỗi không mong muốn");
        }
    }
}