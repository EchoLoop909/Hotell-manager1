package com.example.demo.model;

import lombok.Data;
import java.util.List;

@Data
public class BookingServiceGroupDto {
    private int bookingId;
    private List<BookingServiceItemDto> services;
}