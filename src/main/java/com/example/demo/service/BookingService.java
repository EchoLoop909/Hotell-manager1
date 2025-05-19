package com.example.demo.service;

import com.example.demo.model.BookingDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface BookingService {
    ResponseEntity<?> createBooking(BookingDto bookingDto);
}
