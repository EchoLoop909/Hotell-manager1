package com.example.demo.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BookingDto {
    private int bookingId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String status;
    private BigDecimal totalPrice;
    private int customerId;
    private int employeeId;
    private int roomId;
}