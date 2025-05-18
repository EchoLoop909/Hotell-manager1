package com.example.demo.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BookingRequestDTO {
    @NotNull(message = "ID phòng không được để trống")
    private Integer roomId;

    @NotNull(message = "ID khách hàng không được để trống")
    private Integer customerId;

    @NotBlank(message = "Tên khách hàng không được để trống")
    private String customerName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Số điện thoại không hợp lệ")
    private String customerPhone;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String customerEmail;

    @NotNull(message = "Ngày nhận phòng không được để trống")
    @FutureOrPresent(message = "Ngày nhận phòng phải từ hôm nay trở đi")
    private LocalDate checkIn;

    @NotNull(message = "Ngày trả phòng không được để trống")
    @Future(message = "Ngày trả phòng phải sau ngày nhận phòng")
    private LocalDate checkOut;

    @NotBlank(message = "Phương thức thanh toán không được để trống")
    @Pattern(regexp = "^(VNPay|Visa|Tại quầy)$", message = "Phương thức thanh toán không hợp lệ")
    private String paymentMethod;
}