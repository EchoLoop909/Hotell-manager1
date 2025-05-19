package com.example.demo.model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ServiceDto {
    private Integer id;
    private String description;
    private String name;
    private BigDecimal price;

    public ServiceDto(String name, String description, BigDecimal price) {
        this.name = name;
        this.description = description;
        this.price = price;
    }
}
