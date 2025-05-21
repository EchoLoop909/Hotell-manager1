package com.example.demo.service.impl;

import com.example.demo.model.BookingDto;
import com.example.demo.model.entity.Booking;
import com.example.demo.model.entity.Room;
import com.example.demo.model.entity.RoomStatus;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.EmployeeRepository;
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
import java.util.Optional;

@Service
public class BookingServiceImpl implements BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    @Transactional(rollbackOn = Exception.class)
    public ResponseEntity<?> createBooking(BookingDto dto) {
        try {
            // 1. Kiểm tra trùng lịch
            List<Booking> overlaps = bookingRepository
                    .findByRoom_RoomIdAndCheckOutAfterAndCheckInBefore(
                            dto.getRoomId(), dto.getCheckIn(), dto.getCheckOut()
                    );
            if (!overlaps.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Phòng đã được đặt trong khoảng thời gian này");
            }

            // 2. Kiểm tra tồn tại Customer
            var customerOpt = customerRepository.findById(dto.getCustomerId());
            if (customerOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Không tìm thấy khách hàng với ID = " + dto.getCustomerId());
            }
            var customer = customerOpt.get();

            // 3. Kiểm tra tồn tại Employee
            var employeeOpt = employeeRepository.findById(dto.getEmployeeId());
            if (employeeOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Không tìm thấy nhân viên với ID = " + dto.getEmployeeId());
            }
            var employee = employeeOpt.get();

            // 4. Kiểm tra tồn tại Room
            var roomOpt = roomRepository.findById(dto.getRoomId());
            if (roomOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Không tìm thấy phòng với ID = " + dto.getRoomId());
            }
            var room = roomOpt.get();

            // 5. Kiểm tra thời gian
            long days = ChronoUnit.DAYS.between(dto.getCheckIn(), dto.getCheckOut());
            if (days <= 0) {
                return ResponseEntity.badRequest()
                        .body("Check-out phải sau check-in ít nhất 1 ngày");
            }

            // 6. Tính tổng tiền
            BigDecimal total = room.getPrice().multiply(BigDecimal.valueOf(days));

            // 7. Tạo Booking
            Booking booking = new Booking();
            booking.setCheckIn(dto.getCheckIn());
            booking.setCheckOut(dto.getCheckOut());
            booking.setCustomer(customer);
            booking.setEmployee(employee);
            booking.setRoom(room);

            // Xử lý trạng thái
            try {
                String statusInput = dto.getStatus().trim().toLowerCase();
                Booking.BookingStatus status = null;
                for (Booking.BookingStatus bs : Booking.BookingStatus.values()) {
                    if (bs.getDbValue().equalsIgnoreCase(statusInput)) {
                        status = bs;
                        break;
                    }
                }
                if (status == null) {
                    return ResponseEntity.badRequest()
                            .body("Trạng thái không hợp lệ. Các trạng thái hợp lệ: đã_xác_nhận, đã_hủy");
                }
                booking.setStatus(status);

            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body("Trạng thái không hợp lệ. Các trạng thái hợp lệ: đã_xác_nhận, đã_hủy");
            }

            booking.setTotalPrice(total);

            // 8. Lưu booking
            booking = bookingRepository.save(booking);

            Room room1 = booking.getRoom();
            room1.setStatus(RoomStatus.valueOf("đã_đặt"));
            roomRepository.save(room1);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Đặt phòng thành công");

        } catch (Exception e) {
            logger.error("Lỗi khi tạo booking: {}", e.getMessage(), e);
            throw e; // Ném lại ngoại lệ để rollback
        }
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public ResponseEntity<?> cancelBooking(Integer id) {
        try {
            Optional<Booking> bookingOpt = bookingRepository.findById(id);
            if (bookingOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Không tìm thấy booking với ID = " + id);
            }

            Booking booking = bookingOpt.get();

            // Cập nhật trạng thái booking sang đã_hủy
            booking.setStatus(Booking.BookingStatus.ĐÃ_HỦY);

            // Cập nhật trạng thái phòng sang trống (hoặc trạng thái phù hợp)
            Room room = booking.getRoom();
            room.setStatus(RoomStatus.trống); // Giả sử TRONG là trạng thái phòng trống
            roomRepository.save(room);

            bookingRepository.save(booking);

            return ResponseEntity.ok("Hủy đặt phòng thành công");
        } catch (Exception e) {
            logger.error("Lỗi khi hủy booking: {}", e.getMessage(), e);
            throw e;
        }
    }

}