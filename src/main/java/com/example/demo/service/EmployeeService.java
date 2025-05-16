package com.example.demo.service;

import com.example.demo.model.EmployeeDto;
import com.example.demo.model.entity.Employee;
import org.springframework.http.ResponseEntity;

public interface EmployeeService {

    ResponseEntity<?> createEmployee(EmployeeDto employee);
}
