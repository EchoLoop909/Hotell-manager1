package com.example.demo.service;

import com.example.demo.model.EmployeeDto;
import org.springframework.http.ResponseEntity;

public interface EmployeeService {
    ResponseEntity<?> createEmployee(EmployeeDto employee);

    ResponseEntity<?> getEmployee(Integer id);

    ResponseEntity<?> deleteEmployee(Integer id);

    ResponseEntity<?> updateEmployee(EmployeeDto dto,Integer id);

    ResponseEntity<?> searchEmployees(String name, String email, String role);

}
