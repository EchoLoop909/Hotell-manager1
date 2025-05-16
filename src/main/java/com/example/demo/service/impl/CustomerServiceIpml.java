package com.example.demo.service.impl;

import com.example.demo.model.entity.Customer;
import com.example.demo.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceIpml {
    private final CustomerRepository customerRepository;

    public CustomerServiceIpml(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public void addCustomer(Customer customer) {
        Optional<Customer> existingUser = customerRepository.findByEmail(customer.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email đã tồn tại.");
        }
        customerRepository.save(customer);
    }

    public void updateCustomer(Customer customer) {
        Optional<Customer> existingUser = customerRepository.findById(customer.getCustomerId());
        if (!existingUser.isPresent()) {
            throw new RuntimeException("Khách hàng không tồn tại.");
        }
        customerRepository.save(customer);
    }

    public void deleteCustomer(Integer id) {
        Optional<Customer> existingUser = customerRepository.findById(id);
        if (!existingUser.isPresent()) {
            throw new RuntimeException("Khách hàng không tồn tại.");
        }
        customerRepository.deleteById(id);
    }
}