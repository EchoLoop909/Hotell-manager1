package com.example.demo.repository;

import com.example.demo.model.entity.Booking;
import com.example.demo.model.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    List<Booking> findByRoom_RoomIdAndCheckOutAfterAndCheckInBefore(
            Integer roomId, LocalDate checkIn, LocalDate checkOut);


    Optional<Booking> findByBookingId(Integer id);

    List<Booking> findByCustomer(Customer customer);
}
