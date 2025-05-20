package com.example.demo.service.impl;

import com.example.demo.model.InvoiceDto;
import com.example.demo.model.entity.Booking;
import com.example.demo.model.entity.Invoice;
import com.example.demo.model.entity.Service;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.InvoiceRepository;
import com.example.demo.repository.ServiceRepository;
import com.example.demo.service.InvoiceService;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class InvoiceServiceImpl implements InvoiceService {

    private final BookingRepository bookingRepo;
    private final InvoiceRepository invoiceRepo;
    private final ServiceRepository serviceRepo;

    public InvoiceServiceImpl(BookingRepository bookingRepo,
                              InvoiceRepository invoiceRepo,
                              ServiceRepository serviceRepo) {
        this.bookingRepo = bookingRepo;
        this.invoiceRepo = invoiceRepo;
        this.serviceRepo = serviceRepo;
    }

    @Override
    public InvoiceDto createInvoice(InvoiceDto dto) {
        Assert.notNull(dto, "InvoiceDto must not be null");
        Assert.notNull(dto.getBookingId(), "BookingId must not be null");
        Assert.notNull(dto.getServiceId(), "ServiceId must not be null");

        Booking booking = bookingRepo.findById(dto.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Booking không tồn tại: " + dto.getBookingId()));
        Service service = serviceRepo.findById(dto.getServiceId())
                .orElseThrow(() -> new IllegalArgumentException("Service không tồn tại: " + dto.getServiceId()));

        BigDecimal bookingTotalPrice = booking.getTotalPrice(); // lấy total_price trong Booking
        BigDecimal servicePrice = service.getPrice();

        Assert.notNull(bookingTotalPrice, "Booking total price must not be null");
        Assert.notNull(servicePrice, "Service price must not be null");

        BigDecimal totalAmount = bookingTotalPrice.add(servicePrice);

        Invoice inv = new Invoice();
        inv.setBooking(booking);
        inv.setService(service);
        inv.setTotalAmount(totalAmount);
        inv.setPaymentMethod(Invoice.PaymentMethod.valueOf(dto.getPaymentMethod()));
        inv.setStatus(Invoice.InvoiceStatus.valueOf(dto.getStatus()));
        inv.setPaymentDate(dto.getPaymentDate() != null ? dto.getPaymentDate() : LocalDateTime.now());

        Invoice saved = invoiceRepo.save(inv);
        return toDto(saved);
    }

    @Override
    public InvoiceDto getInvoiceById(Integer id) {
        Invoice inv = invoiceRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice không tồn tại với ID: " + id));
        return toDto(inv);
    }

    @Override
    public InvoiceDto updateInvoice(Integer id, InvoiceDto dto) {
        Assert.notNull(dto, "InvoiceDto must not be null");

        Invoice inv = invoiceRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice không tồn tại với ID: " + id));

        if (dto.getBookingId() != null) {
            Booking booking = bookingRepo.findById(dto.getBookingId())
                    .orElseThrow(() -> new IllegalArgumentException("Booking không tồn tại: " + dto.getBookingId()));
            inv.setBooking(booking);
        }
        if (dto.getServiceId() != null) {
            Service service = serviceRepo.findById(dto.getServiceId())
                    .orElseThrow(() -> new IllegalArgumentException("Service không tồn tại: " + dto.getServiceId()));
            inv.setService(service);
        }
        if (dto.getPaymentMethod() != null) {
            inv.setPaymentMethod(Invoice.PaymentMethod.valueOf(dto.getPaymentMethod()));
        }
        if (dto.getStatus() != null) {
            inv.setStatus(Invoice.InvoiceStatus.valueOf(dto.getStatus()));
        }
        if (dto.getPaymentDate() != null) {
            inv.setPaymentDate(dto.getPaymentDate());
        }
        // Recompute total if room/service changed:
        BigDecimal roomPrice = inv.getBooking().getRoom().getPrice();
        BigDecimal servicePrice = inv.getService().getPrice();
        inv.setTotalAmount(roomPrice.add(servicePrice));

        Invoice updated = invoiceRepo.save(inv);
        return toDto(updated);
    }

    @Override
    public void deleteInvoice(Integer id) {
        if (!invoiceRepo.existsById(id)) {
            throw new IllegalArgumentException("Invoice không tồn tại với ID: " + id);
        }
        invoiceRepo.deleteById(id);
    }

    @Override
    public List<InvoiceDto> getAllInvoices() {
        return invoiceRepo.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private InvoiceDto toDto(Invoice inv) {
        InvoiceDto dto = new InvoiceDto();
        dto.setInvoiceId(inv.getInvoiceId());
        dto.setBookingId(inv.getBooking().getBookingId());
        dto.setServiceId(inv.getService().getServiceId());
        dto.setTotalAmount(inv.getTotalAmount());
        dto.setPaymentMethod(inv.getPaymentMethod().name());
        dto.setStatus(inv.getStatus().name());
        dto.setPaymentDate(inv.getPaymentDate());
        return dto;
    }
}
