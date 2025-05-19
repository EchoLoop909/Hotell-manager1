package com.example.demo.service;

import com.example.demo.model.ServiceDto;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;

public interface ServiceService {
    ResponseEntity<?> createService(ServiceDto serviceDto);

    ResponseEntity<?> getService(String name, String description, BigDecimal price);

    ResponseEntity<?> deleteService(Integer id);

    ResponseEntity<?> updateService(ServiceDto dto);
}
