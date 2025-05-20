package com.example.demo.model.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int bookingId;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = true)
    private Employee employee;

    @Column(nullable = false)
    private LocalDate checkIn;

    @Column(nullable = false)
    private LocalDate checkOut;

    @Column(nullable = false)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('đã_xác_nhận', 'đã_hủy') DEFAULT 'đã_xác_nhận'")
    private BookingStatus status;

    public enum BookingStatus {
        ĐÃ_XÁC_NHẬN("đã_xác_nhận"),
        ĐÃ_HỦY("đã_hủy");

        private final String dbValue;

        BookingStatus(String dbValue) {
            this.dbValue = dbValue;
        }

        @JsonValue
        public String getDbValue() {
            return dbValue;
        }

        @JsonCreator
        public static BookingStatus fromDbValue(String value) {
            for (BookingStatus status : BookingStatus.values()) {
                if (status.dbValue.equalsIgnoreCase(value.trim())) {
                    return status;
                }
            }
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + value);
        }
    }

}