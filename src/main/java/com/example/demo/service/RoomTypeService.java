package com.example.demo.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public interface RoomTypeService {
    ResponseEntity<?> searchRoom(Integer capacity, String name, String description, BigDecimal minPrice,BigDecimal maxPrice );
}
