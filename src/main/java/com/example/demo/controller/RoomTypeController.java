package com.example.demo.controller;

import com.example.demo.model.RoomTypeDto;
import com.example.demo.service.RoomTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/roomType")
@RequiredArgsConstructor
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    @GetMapping("/search")
    public ResponseEntity<?>searchRoom(@RequestParam(required = false) Integer capacity,
                                       @RequestParam(required = false) String name,
                                       @RequestParam(required = false) String description,
                                       @RequestParam(required = false) BigDecimal minPrice,
                                       @RequestParam(required = false) BigDecimal maxPrice ){
    return roomTypeService.searchRoom(capacity,name,description,minPrice,maxPrice);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRoomType(@RequestBody RoomTypeDto roomTypeDto){
        return roomTypeService.create(roomTypeDto);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateRoomType(@PathVariable Integer id,
                                            @RequestBody RoomTypeDto roomTypeDto) {
        return roomTypeService.updateRoomType(id, roomTypeDto);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteRoomType(@PathVariable Integer id) {
        return roomTypeService.deleteRoomType(id);
    }

    @GetMapping("/getall")
    public ResponseEntity<List<RoomTypeDto>> getAllRoomTypes() {
        return roomTypeService.getAllRoomTypes();
    }
}
