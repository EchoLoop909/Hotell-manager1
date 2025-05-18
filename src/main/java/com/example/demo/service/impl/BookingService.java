package com.example.demo.service.impl;

import com.example.demo.dto.BookingRequestDTO;
import com.example.demo.dto.BookingResponseDTO;
import com.example.demo.model.entity.Booking;
import com.example.demo.model.entity.Customer;
import com.example.demo.model.entity.Room;
import com.example.demo.model.entity.RoomStatus;
import com.example.demo.model.response.CancelBookingResponseDTO;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.RoomRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PaymentService paymentService;

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request) {
        // Kiểm tra phòng
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Phòng không tồn tại"));

        if (!room.getStatus().equals(RoomStatus.trống)) {
            throw new IllegalArgumentException("Phòng đã được đặt hoặc đang dọn dẹp");
        }

        // Kiểm tra khách hàng
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Khách hàng không tồn tại"));

        // Kiểm tra ngày nhận/trả phòng
        if (request.getCheckIn().isAfter(request.getCheckOut())) {
            throw new IllegalArgumentException("Ngày nhận phòng phải trước ngày trả phòng");
        }

        // Tính giá
        long days = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        BigDecimal totalPrice = room.getPrice().multiply(BigDecimal.valueOf(days));

        // Xử lý thanh toán
        boolean paymentSuccess = paymentService.processPayment(request.getPaymentMethod(), totalPrice);
        if (!paymentSuccess) {
            throw new IllegalArgumentException("Thanh toán thất bại, vui lòng thử lại");
        }

        // Tạo booking
        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setCustomer(customer);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setTotalPrice(totalPrice);
        booking.setStatus(Booking.BookingStatus.đã_xác_nhận);

        // Cập nhật trạng thái phòng
        room.setStatus(RoomStatus.đã_đặt);
        roomRepository.save(room);

        // Lưu booking
        Booking savedBooking = bookingRepository.save(booking);

        // Trả về response
        BookingResponseDTO response = new BookingResponseDTO();
        response.setBookingId(savedBooking.getBookingId());
        response.setCustomerName(customer.getName());
        response.setRoomSku(room.getSku());
        response.setCheckIn(savedBooking.getCheckIn());
        response.setCheckOut(savedBooking.getCheckOut());
        response.setTotalPrice(savedBooking.getTotalPrice());
        response.setStatus(savedBooking.getStatus().name());
        response.setPaymentStatus("Thành công");

        return response;
    }

    @Transactional
    public CancelBookingResponseDTO cancelBooking(int bookingId) {
        // Kiểm tra đặt phòng
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Đặt phòng không tồn tại"));

        // Kiểm tra trạng thái đặt phòng
        if (booking.getStatus() == Booking.BookingStatus.đã_hủy) {
            throw new IllegalArgumentException("Đặt phòng đã được hủy");
        }

        // Cập nhật trạng thái đặt phòng
        booking.setStatus(Booking.BookingStatus.đã_hủy);
        bookingRepository.save(booking);

        // Cập nhật trạng thái phòng
        Room room = booking.getRoom();
        room.setStatus(RoomStatus.trống);
        roomRepository.save(room);

        // Trả về phản hồi
        CancelBookingResponseDTO response = new CancelBookingResponseDTO();
        response.setBookingId(bookingId);
        response.setStatus(booking.getStatus().name());
        response.setMessage("Hủy đặt phòng thành công");

        return response;
    }
}