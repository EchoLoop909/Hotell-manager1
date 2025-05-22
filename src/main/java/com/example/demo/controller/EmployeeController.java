package com.example.demo.controller;

import com.example.demo.model.EmployeeDto;
import com.example.demo.model.entity.Employee;
import com.example.demo.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(
        path = "/api/v1/employees",
        produces = MediaType.APPLICATION_JSON_VALUE    // tất cả trả về JSON
)
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody EmployeeDto employeeDto) {
        Employee employee = employeeService.createEmployee(employeeDto);
        return ResponseEntity.ok(employee);
    }

    // Read by ID
    @GetMapping("/get")
    public ResponseEntity<?> getEmployee(@RequestParam Integer id) {
        return employeeService.getEmployee(id);
    }

    // Read all
    @GetMapping("/getAll")
    public ResponseEntity<?> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    // Search với 3 tham số tùy chọn
    @GetMapping("/search")
    public ResponseEntity<?> searchEmployees(
            @RequestParam(required = false, defaultValue = "") String name,
            @RequestParam(required = false, defaultValue = "") String email,
            @RequestParam(required = false, defaultValue = "") String role) {
        // Nếu cả 3 đều rỗng, trả về tất cả
        if (name.isBlank() && email.isBlank() && role.isBlank()) {
            return employeeService.getAllEmployees();
        }
        return employeeService.searchEmployees(name, email, role);
    }

    // Update
    @PutMapping(
            path = "/update",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> updateEmployee(
            @RequestBody EmployeeDto dto,
            @RequestParam Integer id) {
        return employeeService.updateEmployee(dto, id);
    }

    // Delete
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteEmployee(@RequestParam Integer id) {
        return employeeService.deleteEmployee(id);
    }
}
