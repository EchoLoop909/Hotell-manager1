package com.example.demo.service.impl;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PaymentService {

    public boolean processPayment(String paymentMethod, BigDecimal amount) {
        // Giả lập xử lý thanh toán
        switch (paymentMethod) {
            case "VNPay":
            case "Visa":
                // Gọi API thanh toán của VNPay/Visa (giả lập thành công)
                return true;
            case "Tại quầy":
                // Thanh toán tại quầy luôn thành công
                return true;
            default:
                return false;
        }
    }
}
