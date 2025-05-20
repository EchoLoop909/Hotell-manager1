package com.example.demo.model;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class InvoiceDto {
    private Integer invoiceId;
    private LocalDateTime paymentDate;
    private String paymentMethod; // "VNPay", "Visa", "tại_quầy"
    private String status; // "đã_thanh_toán", "chưa_thanh_toán"
    private BigDecimal totalAmount;
    private Integer bookingId;
}
