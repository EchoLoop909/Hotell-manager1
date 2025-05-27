package com.example.demo.service.impl;

import com.example.demo.model.entity.Booking;
import com.example.demo.model.entity.Customer;
import com.example.demo.repository.CustomerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceIpml {
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerServiceIpml(CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public void addCustomer(Customer customer) {
        Optional<Customer> existingUser = customerRepository.findByEmail(customer.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email đã tồn tại.");
        }
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        customerRepository.save(customer);
    }

    public void updateCustomer(Customer customer) {
        Optional<Customer> existingUserOpt = customerRepository.findById(customer.getCustomerId());
        if (!existingUserOpt.isPresent()) {
            throw new RuntimeException("Khách hàng không tồn tại.");
        }

        Customer existingUser = existingUserOpt.get();

        // Cập nhật thông tin
        existingUser.setName(customer.getName());
        existingUser.setEmail(customer.getEmail());
        existingUser.setPhone(customer.getPhone());

        // Nếu có mật khẩu mới thì mã hóa và cập nhật
        if (customer.getPassword() != null && !customer.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(customer.getPassword()));
        }

        customerRepository.save(existingUser);
    }


    public void deleteCustomer(Integer id) {
        Optional<Customer> existingUser = customerRepository.findById(id);
        if (!existingUser.isPresent()) {
            throw new RuntimeException("Khách hàng không tồn tại.");
        }
        customerRepository.deleteById(id);

    }
}