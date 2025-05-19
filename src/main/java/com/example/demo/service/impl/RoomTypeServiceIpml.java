package com.example.demo.service.impl;

import com.example.demo.model.RoomDto;
import com.example.demo.model.RoomTypeDto;
import com.example.demo.model.entity.RoomType;
import com.example.demo.repository.RoomTypeRepository;
import com.example.demo.service.RoomService;
import com.example.demo.service.RoomTypeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class RoomTypeServiceIpml implements RoomTypeService {

    private static final Logger logger = LoggerFactory.getLogger(RoomTypeServiceIpml.class);

    @Autowired
    private RoomTypeRepository roomTypeRepository;


    @Override
    public ResponseEntity<?> searchRoom(Integer capacity, String name, String description, BigDecimal minPrice, BigDecimal maxPrice) {
        try {
        if (capacity != null && capacity < 0) {
            return ResponseEntity.badRequest().body(null);
        }
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            return ResponseEntity.badRequest().body(null);
        }

        List<RoomType> results = roomTypeRepository.searchRoomTypes(name, description, capacity, minPrice, maxPrice);
        if(results == null || results.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy phòng phù hợp");
        }
        return ResponseEntity.ok(results);
        } catch (Exception e) {
            logger.error("Lỗi khi tìm phòng: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @Override
    public ResponseEntity<?> create(RoomTypeDto roomTypeDto) {
        try{
            Optional<RoomType> room = roomTypeRepository.findByName(roomTypeDto.getName());
            if(room.isPresent()){
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Room type name already exists.");
            }

            RoomType roomType = new RoomType();
            roomType.setName(roomTypeDto.getName());
            roomType.setCapacity(roomTypeDto.getCapacity());
            roomType.setDefaultPrice(roomTypeDto.getDefaultPrice());
            roomType.setDescription(roomTypeDto.getDescription());

            roomTypeRepository.save(roomType);
            return ResponseEntity.status(HttpStatus.CREATED).body(roomType);
        }catch(Exception e){
            logger.error("Loi DB: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
