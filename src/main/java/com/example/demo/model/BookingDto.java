package com.example.demo.model;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BookingDto {
    private Integer bookingId; // Optional, có thể null khi tạo mới
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String status; // Ví dụ: "DA_XAC_NHAN", "DA_HUY"
    private BigDecimal totalPrice; // Optional, service sẽ tính
    private int customerId;
    private int employeeId;
    private int roomId;
}
