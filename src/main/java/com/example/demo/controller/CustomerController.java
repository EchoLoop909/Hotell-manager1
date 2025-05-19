package com.example.demo.controller;

import com.example.demo.model.entity.Customer;
import com.example.demo.service.impl.CustomerServiceIpml;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Controller
public class CustomerController {
    private final CustomerServiceIpml customerServiceIpml;

    public CustomerController(CustomerServiceIpml customerServiceIpml) {
        this.customerServiceIpml = customerServiceIpml;
    }

    @GetMapping("/api/v1/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerServiceIpml.getAllCustomers());
    }

    @PostMapping("/api/v1/customers/add")
    public ResponseEntity<?> addCustomer(@RequestBody Customer customer) {
        try {
            customerServiceIpml.addCustomer(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body("Thêm khách hàng thành công.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + e.getMessage());
        }
    }

    @PutMapping("/api/v1/customers/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Integer id, @RequestBody Customer customer) {
        try {
            customer.setCustomerId(id);
            customerServiceIpml.updateCustomer(customer);
            return ResponseEntity.ok("Cập nhật khách hàng thành công.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + e.getMessage());
        }
    }

    @DeleteMapping("/api/v1/customers/delete/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Integer id) {
        try {
            customerServiceIpml.deleteCustomer(id);
            return ResponseEntity.ok("Xóa khách hàng thành công.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + e.getMessage());
        }
    }
}