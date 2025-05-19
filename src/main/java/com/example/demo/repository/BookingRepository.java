package com.example.demo.repository;

import com.example.demo.model.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    List<Booking> findByRoom_RoomIdAndCheckOutAfterAndCheckInBefore(
            Integer roomId, LocalDate checkIn, LocalDate checkOut);

    Booking findByCustomer_CustomerId(Integer customerId);

    Booking findByEmployee_EmployeeId(Integer employeeId);
}
