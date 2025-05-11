package com.example.demo.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode(of = "serviceId")
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int serviceId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;
}