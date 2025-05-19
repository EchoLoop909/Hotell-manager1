package com.example.demo.model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RoomTypeDto {
    private int capacity;
    private BigDecimal defaultPrice;
    private String description;
    private String name;
}