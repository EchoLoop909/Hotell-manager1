package com.example.demo.service;

import com.example.demo.model.RoomDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface RoomService {
    ResponseEntity<RoomDto> createRoom(RoomDto roomDto);
    ResponseEntity<List<RoomDto>> getAllRooms();
    ResponseEntity<RoomDto> getRoomById(int id);
    ResponseEntity<RoomDto> updateRoom(int id, RoomDto roomDto);
    ResponseEntity<Void> deleteRoom(int id);
}