package com.example.demo.model;

import lombok.Data;

@Data
public class BookingServiceDto {
    private int bookingId;
    private int serviceId;
    private int quantity;
}