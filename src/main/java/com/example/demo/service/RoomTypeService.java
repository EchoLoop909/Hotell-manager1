package com.example.demo.service;

import com.example.demo.model.RoomTypeDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public interface RoomTypeService {
    ResponseEntity<?> searchRoom(Integer capacity, String name, String description, BigDecimal minPrice,BigDecimal maxPrice );

    ResponseEntity<?> create(RoomTypeDto roomTypeDto);

    ResponseEntity<?> updateRoomType(Integer id, RoomTypeDto roomTypeDto);

    ResponseEntity<?> deleteRoomType(Integer id);

    ResponseEntity<List<RoomTypeDto>> getAllRoomTypes();
}
