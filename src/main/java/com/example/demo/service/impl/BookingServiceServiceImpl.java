package com.example.demo.service.impl;

import com.example.demo.model.BookingServiceGroupDto;
import com.example.demo.model.BookingServiceItemDto;
import com.example.demo.model.entity.Booking;
import com.example.demo.model.entity.BookingService;
import com.example.demo.model.entity.Service;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.BookingServiceRepository;
import com.example.demo.repository.ServiceRepository;
import com.example.demo.service.BookingServiceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.Optional;

@org.springframework.stereotype.Service
public class BookingServiceServiceImpl implements BookingServiceService {

    private static final Logger logger = LoggerFactory.getLogger(BookingServiceServiceImpl.class);

    private final BookingServiceRepository bookingServiceRepository;
    private final ServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;

    public BookingServiceServiceImpl(BookingServiceRepository bookingServiceRepository,
                                     ServiceRepository serviceRepository,
                                     BookingRepository bookingRepository) {
        this.bookingServiceRepository = bookingServiceRepository;
        this.serviceRepository = serviceRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public ResponseEntity<?> createBookingServices(BookingServiceGroupDto dto) {
        try {
            // 1. Lấy Booking
            Optional<Booking> bookingOpt = bookingRepository.findById(dto.getBookingId());
            if (bookingOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Không tìm thấy booking ID: " + dto.getBookingId());
            }
            Booking booking = bookingOpt.get();

            // 2. Duyệt các dịch vụ
            for (BookingServiceItemDto item : dto.getServices()) {
                Optional<Service> serviceOpt = serviceRepository.findById(item.getServiceId());
                if (serviceOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Không tìm thấy dịch vụ ID: " + item.getServiceId());
                }
                Service service = serviceOpt.get();

                // Tính tổng tiền
                BigDecimal total = service.getPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity()));

                BookingService bs = new BookingService();
                bs.setBooking(booking);
                bs.setService(service);
                bs.setQuantity(item.getQuantity());
                bs.setTotalPrice(total);

                bookingServiceRepository.save(bs);
            }

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Tạo dịch vụ thành công cho booking ID " + dto.getBookingId());

        } catch (Exception e) {
            logger.error("Lỗi khi tạo booking services", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi không mong muốn: " + e.getMessage());
        }
    }
}