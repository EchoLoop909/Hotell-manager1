package com.example.demo.service.impl;

import com.example.demo.model.EmployeeDto;
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
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeServiceImpl.class);

    private final EmployeeRepository employeeRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Employee createEmployee(EmployeeDto dto) {
        String roleStr = dto.getEmployeeRole();

        if (roleStr == null || roleStr.isBlank()) {
            throw new IllegalArgumentException("Employee role must not be null or empty");
        }

        Employee.EmployeeRole role;
        try {
            role = Employee.EmployeeRole.valueOf(roleStr.trim().toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Vai trò không hợp lệ: " + roleStr);
        }

        Employee employee = new Employee();
        employee.setName(dto.getName());
        employee.setEmail(dto.getEmail());
        employee.setPassword(passwordEncoder.encode(dto.getPassword()));
        employee.setEmployeeRole(role);

        return employeeRepository.save(employee);
    }

    @Override
    public ResponseEntity<?> getEmployee(Integer id) {
        return employeeRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nhân viên không tồn tại"));
    }

    @Override
    public ResponseEntity<?> getAllEmployees() {
        try {
            List<EmployeeDto> dtos = employeeRepository.findAll()
                    .stream()
                    .map(e -> new EmployeeDto(
                            e.getEmployeeId(),  // map ID ở đây
                            e.getName(),
                            e.getEmail(),
                            e.getEmployeeRole().name() // chuyển enum sang String
                    ))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            logger.error("Lỗi lấy danh sách nhân viên: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching employees: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> searchEmployees(String name, String email, String role) {
        if (name.isBlank() && email.isBlank() && role.isBlank()) {
            return getAllEmployees();
        }
        try {
            Employee.EmployeeRole empRole = null;
            if (!role.isBlank()) {
                String norm = role.trim().toUpperCase().replace(" ", "_");
                empRole = Employee.EmployeeRole.valueOf(norm);
            }
            List<Employee> list = employeeRepository.searchByNameEmailRole(name, email, empRole);
            if (list.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy nhân viên phù hợp");
            }

            List<EmployeeDto> dtos = list.stream()
                    .map(e -> new EmployeeDto(
                            e.getEmployeeId(),
                            e.getName(),
                            e.getEmail(),
                            e.getEmployeeRole().name()
                    ))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(dtos);
        } catch (IllegalArgumentException e) {
            logger.error("Vai trò không hợp lệ: {}", role, e);
            return ResponseEntity.badRequest().body("Vai trò không hợp lệ");
        } catch (Exception e) {
            logger.error("Lỗi tìm kiếm nhân viên: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi không mong muốn");
        }
    }

    @Override
    public ResponseEntity<?> updateEmployee(EmployeeDto dto, Integer id) {
        Optional<Employee> opt = employeeRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nhân viên không tồn tại");
        }
        try {
            Employee emp = opt.get();
            emp.setName(dto.getName());
            emp.setEmail(dto.getEmail());
            emp.setPassword(passwordEncoder.encode(dto.getPassword()));
            String norm = dto.getEmployeeRole().trim().toUpperCase().replace(" ", "_");
            emp.setEmployeeRole(Employee.EmployeeRole.valueOf(norm));
            employeeRepository.save(emp);
            return ResponseEntity.ok("UPDATE Employee OK");
        } catch (Exception e) {
            logger.error("Lỗi cập nhật nhân viên: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi không mong muốn");
        }
    }

    @Override
    public ResponseEntity<?> deleteEmployee(Integer id) {
        Optional<Employee> opt = employeeRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nhân viên không tồn tại");
        }
        try {
            Employee emp = opt.get();
            bookingRepository.findByEmployee(Optional.of(emp))
                    .forEach(b -> b.setEmployee(null));
            employeeRepository.deleteById(id);
            return ResponseEntity.ok("DELETE Employee OK");
        } catch (Exception e) {
            logger.error("Lỗi xóa nhân viên: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi không mong muốn");
        }
    }

    @Override
    public ResponseEntity<EmployeeDto> getCurrentEmployee(String email) {
        return employeeRepository.findByEmail(email)
                .map(emp -> {
                    EmployeeDto dto = new EmployeeDto(
                            emp.getEmployeeId(),
                            emp.getName(),
                            emp.getEmail(),
                            emp.getEmployeeRole().name()
                    );
                    return ResponseEntity.ok(dto);
                })
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy thông tin người dùng"));
    }
}
