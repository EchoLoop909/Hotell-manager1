package com.example.demo.service;

import com.example.demo.model.BookingServiceDto;
import com.example.demo.model.BookingServiceGroupDto;
import org.springframework.http.ResponseEntity;

public interface BookingServiceService {
    ResponseEntity<?> createBookingServices(BookingServiceGroupDto dto);
}
