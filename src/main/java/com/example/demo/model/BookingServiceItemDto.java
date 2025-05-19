package com.example.demo.model;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class BookingServiceItemDto {
    private int serviceId;
    private int quantity;
}