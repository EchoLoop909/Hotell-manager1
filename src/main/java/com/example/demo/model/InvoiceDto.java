package com.example.demo.model;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class InvoiceDto {
    private Integer invoiceId;
    private Integer bookingId;
    private Integer serviceId;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String status;

    private LocalDateTime paymentDate;
}
