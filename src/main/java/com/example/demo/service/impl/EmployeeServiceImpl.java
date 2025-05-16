//package com.example.demo.service.impl;
//
//import com.example.demo.model.EmployeeDto;
//import com.example.demo.model.entity.Employee;
//import com.example.demo.repository.EmployeeRepository;
//import com.example.demo.service.EmployeeService;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
//@Service
//public class EmployeeServiceIpml implements EmployeeService {
//
//    private static final Logger logger = LoggerFactory.getLogger(EmployeeServiceIpml.class);
//
//    @Autowired
//    private EmployeeRepository employeeRepository;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    public ResponseEntity<?> createEmployee(EmployeeDto employee) {
//        try {
//            logger.info("Attempting to create employee with email: {}", employee.getEmail());
//            Optional<Employee> existingEmployee = employeeRepository.findByEmail(employee.getEmail());
//            if (existingEmployee.isPresent()) {
//                logger.warn("Email {} already exists", employee.getEmail());
//                return new ResponseEntity<>("Email Already Exists", HttpStatus.CONFLICT);
//            }
//
//            Employee newEmployee = new Employee();
//            newEmployee.setEmail(employee.getEmail());
//            newEmployee.setName(employee.getName());
//            newEmployee.setPassword(passwordEncoder.encode(employee.getPassword()));
//            newEmployee.setEmployeeRole(Employee.EmployeeRole.valueOf(employee.getEmployee_role()));
//
//            employeeRepository.save(newEmployee);
//            logger.info("Employee created successfully: {}", employee.getEmail());
//
//            return new ResponseEntity<>("Employee Created Successfully", HttpStatus.CREATED);
//        } catch (IllegalArgumentException e) {
//            logger.error("Invalid role: {}", employee.getEmployee_role(), e);
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid role: " + e.getMessage());
//        } catch (Exception e) {
//            logger.error("Error creating employee: {}", e.getMessage(), e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
//        }
//    }
//
//}


package com.example.demo.service.impl;

import com.example.demo.model.EmployeeDto;
import com.example.demo.model.entity.Employee;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.service.EmployeeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeServiceImpl.class);

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public ResponseEntity<?> createEmployee(EmployeeDto employee) {
        try {
            logger.info("Attempting to create employee with email: {}", employee.getEmail());
            Optional<Employee> existingEmployee = employeeRepository.findByEmail(employee.getEmail());
            if (existingEmployee.isPresent()) {
                logger.warn("Email {} already exists", employee.getEmail());
                return new ResponseEntity<>("Email Already Exists", HttpStatus.CONFLICT);
            }

            Employee newEmployee = new Employee();
            newEmployee.setEmail(employee.getEmail());
            newEmployee.setName(employee.getName());
            newEmployee.setPassword(passwordEncoder.encode(employee.getPassword()));

            // Ánh xạ employee_role
            String roleInput = employee.getEmployee_role().trim().toUpperCase().replace(" ", "_");
            switch (roleInput) {
                case "QUẢN_LÝ":
                case "QUAN_LY":
                case "quản_lý":
                    newEmployee.setEmployeeRole(Employee.EmployeeRole.QUAN_LY);
                    break;
                case "LỄ_TÂN":
                case "LE_TAN":
                case "lễ_tân":
                    newEmployee.setEmployeeRole(Employee.EmployeeRole.LE_TAN);
                    break;
                default:
                    logger.error("Invalid role: {}", employee.getEmployee_role());
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid role: " + employee.getEmployee_role());
            }

            employeeRepository.save(newEmployee);
            logger.info("Employee created successfully: {}", employee.getEmail());

            return new ResponseEntity<>("Employee Created Successfully", HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid role: {}", employee.getEmployee_role(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid role: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error creating employee: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}