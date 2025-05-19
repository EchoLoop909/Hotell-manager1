package com.example.demo.controller;

import com.example.demo.model.BookingServiceGroupDto;
import com.example.demo.service.BookingServiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/booking-services")
public class BookingServiceController {

    private final BookingServiceService bookingServiceService;

    public BookingServiceController(BookingServiceService bookingServiceService) {
        this.bookingServiceService = bookingServiceService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBookingServices(@RequestBody BookingServiceGroupDto dto) {
        return bookingServiceService.createBookingServices(dto);
    }
}