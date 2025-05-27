package com.example.demo.controller;

import com.example.demo.model.BookingDto;
import com.example.demo.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/bookingRoom")
    public ResponseEntity<?> createBooking(@RequestBody BookingDto bookingDto) {
        return bookingService.createBooking(bookingDto);
    }

    @PostMapping("/CancelbookingRoom")
    public ResponseEntity<?> cancelBooking(@RequestParam Integer id) {
        return bookingService.cancelBooking(id);
    }


}