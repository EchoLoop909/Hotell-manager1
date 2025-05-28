package com.example.demo.controller;

import com.example.demo.model.BookingDto;
import com.example.demo.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{id}")
    public ResponseEntity<BookingDto> getBookingById(@PathVariable Integer id) {
        ResponseEntity<BookingDto> response = bookingService.getBookingById(id);
        if (response.getBody() != null) {
            return response;
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}