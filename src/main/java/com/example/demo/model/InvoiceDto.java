package com.example.demo.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Getter
@Setter

public class InvoiceDto {
    private Integer invoiceId;
    private Integer bookingId;
    private Integer serviceId;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String status;

    private LocalDateTime paymentDate;
    private String customerName;
    private String roomName;
    private String roomTypeName;
    private String serviceName;
    private String roomSku;
}
