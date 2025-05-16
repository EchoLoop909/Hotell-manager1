package com.example.demo.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int invoiceId;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('đã_thanh_toán', 'chưa_thanh_toán') DEFAULT 'chưa_thanh_toán'")
    private InvoiceStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('VNPay', 'Visa', 'tại_quầy')")
    private PaymentMethod paymentMethod;

    private LocalDateTime paymentDate;

    public enum InvoiceStatus {
        đã_thanh_toán, chưa_thanh_toán
    }

    public enum PaymentMethod {
        VNPay, Visa, tại_quầy
    }
}