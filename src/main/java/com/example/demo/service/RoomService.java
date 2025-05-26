package com.example.demo.service;

import com.example.demo.model.RoomDto;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

public interface RoomService {
    ResponseEntity<RoomDto> createRoom(RoomDto roomDto);
    ResponseEntity<List<RoomDto>> getAllRooms();
    ResponseEntity<RoomDto> getRoomById(int id);
    ResponseEntity<RoomDto> updateRoom(int id, RoomDto roomDto);
    ResponseEntity<Void> deleteRoom(int id);
    ResponseEntity<List<RoomDto>> searchAvailableRooms(LocalDate checkIn, LocalDate checkOut, Integer roomTypeId);
}