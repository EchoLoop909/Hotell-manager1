package com.example.demo.service.impl;

import com.example.demo.model.EmployeeDto;
import com.example.demo.model.entity.Booking;
import com.example.demo.model.entity.Employee;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeServiceImpl.class);

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final BookingRepository bookingRepository;

    @Override
    public ResponseEntity<?> createEmployee(EmployeeDto dto) {
        logger.info("Tạo nhân viên: {}", dto.getEmail());

        Optional<Employee> existing = employeeRepository.findByEmail(dto.getEmail());
        if (existing.isPresent()) {
            logger.warn("Email đã tồn tại: {}", dto.getEmail());
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email đã tồn tại");
        }

        try {
            Employee emp = new Employee();
            emp.setEmail(dto.getEmail());
            emp.setName(dto.getName());
            emp.setPassword(passwordEncoder.encode(dto.getPassword()));

            if (dto.getEmployeeRole() == null) {
                throw new IllegalArgumentException("Employee role must not be null");
            }

            String normalizedRole = dto.getEmployeeRole().trim().toUpperCase().replace(" ", "_");
            emp.setEmployeeRole(Employee.EmployeeRole.valueOf(normalizedRole));

            Employee savedEmployee = employeeRepository.save(emp);
            logger.info("Nhân viên đã được tạo: {}", savedEmployee.getEmail());

            return ResponseEntity.status(HttpStatus.CREATED).body("Nhân viên đã được tạo");

        } catch (IllegalArgumentException e) {
            logger.error("Vai trò không hợp lệ: {}", dto.getEmployeeRole(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Vai trò không hợp lệ");
        } catch (Exception e) {
            logger.error("Lỗi không mong muốn: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi không mong muốn");
        }
    }

    @Override
    public ResponseEntity<?> getEmployee(Integer id) {
        try {
            Optional<Employee> optionalEmployee = employeeRepository.findById(id);
            if (optionalEmployee.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nhân viên không tồn tại");
            }

            return ResponseEntity.ok(optionalEmployee.get());
        } catch (Exception e) {
            logger.error("Lỗi không mong muốn: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi không mong muốn");
        }
    }

    @Override
    public ResponseEntity<?> deleteEmployee(Integer id) {
        try {
            Optional<Employee> optionalEmployee = employeeRepository.findById(id);
            if (optionalEmployee.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nhân viên không tồn tại");
            }

            Employee employee = optionalEmployee.get();

            List<Booking> bookings = bookingRepository.findByEmployee(Optional.of(employee));
            for (Booking b : bookings) {
                b.setEmployee(null);
            }

            employeeRepository.deleteById(id);

            return ResponseEntity.status(HttpStatus.OK).body("DELETE Employee OK");
        } catch (Exception e) {
            logger.error("Lỗi không mong muốn: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi không mong muốn");
        }
    }

    @Override
    public ResponseEntity<?> updateEmployee(EmployeeDto dto, Integer id) {
        try {
            Optional<Employee> optionalEmployee = employeeRepository.findById(id);
            if (optionalEmployee.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nhân viên không tồn tại");
            }

            Employee emp = optionalEmployee.get();
            emp.setEmail(dto.getEmail());
            emp.setName(dto.getName());
            emp.setEmployeeRole(Employee.EmployeeRole.valueOf(dto.getEmployeeRole()));
            emp.setPassword(passwordEncoder.encode(dto.getPassword()));

            employeeRepository.save(emp);

            return ResponseEntity.status(HttpStatus.OK).body("UPDATE Employee OK");

        } catch (Exception e) {
            logger.error("Lỗi không mong muốn: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi không mong muốn");
        }
    }

    @Override
    public ResponseEntity<?> searchEmployees(String name, String email, String role) {
        try {
            String normalizedRole = role.trim().toUpperCase().replace(" ", "_");
            Employee.EmployeeRole employeeRole = Employee.EmployeeRole.valueOf(normalizedRole);

            List<Employee> employees = employeeRepository.searchByNameEmailRole(name, email, employeeRole);

            if (employees.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy nhân viên phù hợp");
            }

            return ResponseEntity.ok(employees);

        } catch (IllegalArgumentException e) {
            logger.error("Vai trò không hợp lệ: {}", role, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Vai trò không hợp lệ");
        } catch (Exception e) {
            logger.error("Lỗi không mong muốn: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi không mong muốn");
        }
    }

}
