package com.example.demo.service.impl;

import com.example.demo.model.BookingDto;
import com.example.demo.model.entity.Booking;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.RoomRepository;
import com.example.demo.service.BookingService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;


@Service
public class BookingServiceIpml implements BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingServiceIpml.class);

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PaymentService paymentService;

    @Transactional
    public ResponseEntity<?> createBooking(BookingDto bookingDto) {
        try{
            // Kiểm tra trùng lịch
            List<Booking> overlappingBookings = bookingRepository.findByRoom_RoomIdAndCheckOutAfterAndCheckInBefore(
                    bookingDto.getRoomId(),
                    bookingDto.getCheckIn(),
                    bookingDto.getCheckOut()
            );

            if (!overlappingBookings.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Phòng đã được đặt trong khoảng thời gian này");
            }

            Booking bookingCustommer = bookingRepository.findByCustomer_CustomerId(bookingDto.getCustomerId());
            if(bookingCustommer == null){
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Khong ton tai khach hang");
            }

            Booking bookingEmployee = bookingRepository.findByEmployee_EmployeeId(bookingDto.getEmployeeId());
            if(bookingCustommer == null){
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Khong ton tai khach hang");
            }

            //Kiem tra ton tai Room
            var optRoom = roomRepository.findById(bookingDto.getRoomId());
            if (optRoom.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Không tìm thấy phòng với ID = " + bookingDto.getRoomId());
            }
            var room = optRoom.get();
            // Tính số ngày
            long days = ChronoUnit.DAYS.between(
                    bookingDto.getCheckIn(), bookingDto.getCheckOut());
            if (days <= 0) {
                return ResponseEntity.badRequest()
                        .body("Check-out phải sau check-in ít nhất 1 ngày");
            }

            // Tính tổng tiền = giá phòng × số ngày
            BigDecimal total = room.getPrice()
                    .multiply(BigDecimal.valueOf(days));

            // Nếu không trùng lịch thì tiến hành lưu booking mới
            Booking booking = new Booking();
            booking.setCheckIn(bookingDto.getCheckIn());
            booking.setCheckOut(bookingDto.getCheckOut());
            booking.setCustomer(booking.getCustomer());
            booking.setEmployee(booking.getEmployee());
            booking.setRoom(booking.getRoom());
            booking.setStatus(Booking.BookingStatus.valueOf("dda xac nhan"));
            booking.setTotalPrice(total);

            bookingRepository.save(booking);

            return ResponseEntity.status(HttpStatus.CREATED).body("Đặt phòng thành công");
        }catch (Exception e){
            logger.warn("Email đã tồn tại: {}");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email da ton tai");
        }
    }
}