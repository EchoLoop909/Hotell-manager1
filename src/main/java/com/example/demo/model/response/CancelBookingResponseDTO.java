package com.example.demo.model.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CancelBookingResponseDTO {
    private int bookingId;
    private String status;
    private String message;
}
