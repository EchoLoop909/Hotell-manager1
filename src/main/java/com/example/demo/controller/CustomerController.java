package com.example.demo.controller;

import com.example.demo.model.EmployeeDto;
import com.example.demo.model.entity.Customer;
import com.example.demo.service.impl.CustomerServiceIpml;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
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
    @GetMapping("/api/v1/customers/me")
    public ResponseEntity<?> getCurrentCustomer(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String username = userDetails.getUsername(); // Username là email hoặc tên đăng nhập
            Optional<Customer> customer = customerServiceIpml.getCustomerByUsername(username);
            if (customer != null) {
                return ResponseEntity.ok(customer);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy thông tin khách hàng.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi: " + e.getMessage());
        }
    }

}
