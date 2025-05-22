package com.example.demo.service;

import com.example.demo.model.EmployeeDto;
import com.example.demo.model.entity.Employee;
import org.springframework.http.ResponseEntity;

public interface EmployeeService {
    Employee createEmployee(EmployeeDto employeeDto);
    ResponseEntity<?> getEmployee(Integer id);
    ResponseEntity<?> getAllEmployees();
    ResponseEntity<?> searchEmployees(String name, String email, String role);
    ResponseEntity<?> updateEmployee(EmployeeDto dto, Integer id);
    ResponseEntity<?> deleteEmployee(Integer id);
}
