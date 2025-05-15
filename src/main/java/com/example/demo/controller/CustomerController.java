package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.entity.User;
import com.example.demo.service.CustomerService;

import java.util.List;

@Controller
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // Render trang quản lý khách hàng
    @GetMapping("/customers")
    public String showCustomersPage() {
        return "customers"; // src/main/resources/templates/customers.html
    }

    // Lấy danh sách khách hàng
    @GetMapping("/api/v1/customers")
    public ResponseEntity<List<User>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    // Thêm khách hàng
    @PostMapping("/api/v1/customers")
    public ResponseEntity<?> addCustomer(@RequestBody User customer) {
        try {
            customerService.addCustomer(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body("Thêm khách hàng thành công.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + e.getMessage());
        }
    }

    // Sửa khách hàng
    @PutMapping("/api/v1/customers/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody User customer) {
        try {
            customer.setId(id);
            customerService.updateCustomer(customer);
            return ResponseEntity.ok("Cập nhật khách hàng thành công.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + e.getMessage());
        }
    }

    // Xóa khách hàng
    @DeleteMapping("/api/v1/customers/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        try {
            customerService.deleteCustomer(id);
            return ResponseEntity.ok("Xóa khách hàng thành công.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + e.getMessage());
        }
    }
}