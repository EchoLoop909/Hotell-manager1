package com.example.demo.model;

import com.example.demo.model.entity.RoomStatus;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RoomDto {
    private int roomId;
    private String sku;
    private int typeId;
    private BigDecimal price;
    private RoomStatus status;
    private String imageUrl;
}