package com.example.demo.repository;

import com.example.demo.model.entity.BookingService;
import com.example.demo.model.entity.BookingServiceId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingServiceRepository extends JpaRepository<BookingService, BookingServiceId> {
}