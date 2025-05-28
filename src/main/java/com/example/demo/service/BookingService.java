package com.example.demo.service;

import com.example.demo.model.BookingDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
public interface BookingService {
    ResponseEntity<?> createBooking(BookingDto bookingDto);

    ResponseEntity<?> cancelBooking(Integer id);

    ResponseEntity<BookingDto> getBookingById(Integer id);

}
