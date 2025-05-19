package com.example.demo.controller;

import com.example.demo.model.BookingDto;
import com.example.demo.service.BookingService;
import com.example.demo.service.impl.BookingServiceIpml;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    public ResponseEntity<?> createBooking(@RequestBody BookingDto bookingDto) {
        return bookingService.createBooking(bookingDto);
    }
}