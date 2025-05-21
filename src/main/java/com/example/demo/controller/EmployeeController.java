package com.example.demo.controller;

import com.example.demo.model.EmployeeDto;
import com.example.demo.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(
        path = "/api/v1/employees",
        produces = MediaType.APPLICATION_JSON_VALUE,  // đảm bảo luôn trả JSON
        consumes = MediaType.APPLICATION_JSON_VALUE   // nhận JSON
)
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping("/create")
    public ResponseEntity<?> createEmployee(@RequestBody EmployeeDto employee) {
        return employeeService.createEmployee(employee);
    }

    @GetMapping("/get")
    public ResponseEntity<?> getEmployee(@RequestParam Integer id) {
        return employeeService.getEmployee(id);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteEmployee(@RequestParam Integer id) {
        return employeeService.deleteEmployee(id);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateEmployee(@RequestBody EmployeeDto dto, @RequestParam Integer id) {
        return employeeService.updateEmployee(dto , id);
    }

    @GetMapping("/employees/search")
    public ResponseEntity<?> searchEmployees(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String role) {
        return employeeService.searchEmployees(name, email, role);
    }

}
