package com.example.demo.service;

import com.example.demo.model.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    private final UserRepository userRepository;

    public CustomerService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllCustomers() {
        return userRepository.findAll();
    }

    public void addCustomer(User customer) {
        Optional<User> existingUser = userRepository.findByEmail(customer.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email đã tồn tại.");
        }
        userRepository.save(customer);
    }

    public void updateCustomer(User customer) {
        Optional<User> existingUser = userRepository.findById(customer.getId());
        if (!existingUser.isPresent()) {
            throw new RuntimeException("Khách hàng không tồn tại.");
        }
        userRepository.save(customer);
    }

    public void deleteCustomer(Long id) {
        Optional<User> existingUser = userRepository.findById(id);
        if (!existingUser.isPresent()) {
            throw new RuntimeException("Khách hàng không tồn tại.");
        }
        userRepository.deleteById(id);
    }
}