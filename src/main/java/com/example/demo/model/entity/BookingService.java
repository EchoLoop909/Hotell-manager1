package com.example.demo.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "booking_service")
@Data
public class BookingService {
    @Id
    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Id
    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;
}