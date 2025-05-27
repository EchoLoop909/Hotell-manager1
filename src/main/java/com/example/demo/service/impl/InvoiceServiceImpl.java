package com.example.demo.service.impl;

import com.example.demo.model.InvoiceDto;
import com.example.demo.model.entity.*;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.InvoiceRepository;
import com.example.demo.repository.ServiceRepository;
import com.example.demo.service.InvoiceService;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.layout.properties.TextAlignment;
import com.lowagie.text.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.util.Assert;
import com.itextpdf.layout.Document;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
        inv.setPaymentDate(dto.getPaymentDate());

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


    public void exportInvoicePdfById(HttpServletResponse response, Integer invoiceId) throws IOException {
        // Tìm invoice
        Invoice invoice = invoiceRepo.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice không tồn tại với ID: " + invoiceId));

        // Đặt tên file và content type
        response.setContentType("application/pdf");
        String headerValue = "attachment; filename=invoice_" + invoiceId + ".pdf";
        response.setHeader("Content-Disposition", headerValue);

        // Tạo PdfWriter và PdfDocument trên output stream của response
        PdfWriter writer = new PdfWriter(response.getOutputStream());
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        // Tiêu đề
        Paragraph title = new Paragraph("Invoice #" + invoice.getInvoiceId())
                .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD))
                .setFontSize(18)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(title);

        document.add(new Paragraph("\n"));

        // Thông tin invoice
        Table infoTable = new Table(2);
        infoTable.addCell(new Cell().add(new Paragraph("Payment Date")));
        infoTable.addCell(new Cell().add(new Paragraph(invoice.getPaymentDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))));

        infoTable.addCell(new Cell().add(new Paragraph("Payment Method")));
        infoTable.addCell(new Cell().add(new Paragraph(invoice.getPaymentMethod().name())));

        infoTable.addCell(new Cell().add(new Paragraph("Status")));
        infoTable.addCell(new Cell().add(new Paragraph(invoice.getStatus().name())));

        infoTable.addCell(new Cell().add(new Paragraph("Total Amount")));
        infoTable.addCell(new Cell().add(new Paragraph(invoice.getTotalAmount().toString())));

        document.add(infoTable);

        document.add(new Paragraph("\n"));

        // Thông tin Booking
        Booking booking = invoice.getBooking();
        Paragraph bookingTitle = new Paragraph("Booking Details")
                .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD))
                .setFontSize(14);
        document.add(bookingTitle);

        Table bookingTable = new Table(2);
        bookingTable.addCell(new Cell().add(new Paragraph("Booking ID")));
        bookingTable.addCell(new Cell().add(new Paragraph(String.valueOf(booking.getBookingId()))));

        bookingTable.addCell(new Cell().add(new Paragraph("Check-in")));
        bookingTable.addCell(new Cell().add(new Paragraph(booking.getCheckIn().toString())));

        bookingTable.addCell(new Cell().add(new Paragraph("Check-out")));
        bookingTable.addCell(new Cell().add(new Paragraph(booking.getCheckOut().toString())));

        bookingTable.addCell(new Cell().add(new Paragraph("Status")));
        bookingTable.addCell(new Cell().add(new Paragraph(booking.getStatus().name())));

        bookingTable.addCell(new Cell().add(new Paragraph("Total Price")));
        bookingTable.addCell(new Cell().add(new Paragraph(booking.getTotalPrice().toString())));

        document.add(bookingTable);

        document.add(new Paragraph("\n"));

        // Thông tin Service
        com.example.demo.model.entity.Service service = invoice.getService();
        Paragraph serviceTitle = new Paragraph("Service Details")
                .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD))
                .setFontSize(14);
        document.add(serviceTitle);

        Table serviceTable = new Table(2);
        serviceTable.addCell(new Cell().add(new Paragraph("Service ID")));
        serviceTable.addCell(new Cell().add(new Paragraph(String.valueOf(service.getServiceId()))));

        serviceTable.addCell(new Cell().add(new Paragraph("Name")));
        serviceTable.addCell(new Cell().add(new Paragraph(service.getName())));

        serviceTable.addCell(new Cell().add(new Paragraph("Description")));
        serviceTable.addCell(new Cell().add(new Paragraph(service.getDescription())));

        serviceTable.addCell(new Cell().add(new Paragraph("Price")));
        serviceTable.addCell(new Cell().add(new Paragraph(service.getPrice().toString())));

        document.add(serviceTable);

        document.add(new Paragraph("\n"));

        // --- Thông tin Khách hàng ---
        Customer customer = invoice.getBooking().getCustomer();
        Paragraph customerTitle = new Paragraph("Customer Details")
                .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD))
                .setFontSize(14);
        document.add(customerTitle);

        Table customerTable = new Table(2);
        customerTable.addCell(new Cell().add(new Paragraph("Customer ID")));
        customerTable.addCell(new Cell().add(new Paragraph(String.valueOf(customer.getCustomerId()))));

        customerTable.addCell(new Cell().add(new Paragraph("Name")));
        customerTable.addCell(new Cell().add(new Paragraph(customer.getName())));

        customerTable.addCell(new Cell().add(new Paragraph("Email")));
        customerTable.addCell(new Cell().add(new Paragraph(customer.getEmail())));

        customerTable.addCell(new Cell().add(new Paragraph("Phone")));
        customerTable.addCell(new Cell().add(new Paragraph(customer.getPhone())));

// thêm các trường khác nếu cần
        document.add(customerTable);

        document.add(new Paragraph("\n"));

// --- Thông tin Nhân viên ---
        Employee employee = invoice.getBooking().getEmployee();
        Paragraph employeeTitle = new Paragraph("Employee Details")
                .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD))
                .setFontSize(14);
        document.add(employeeTitle);

        Table employeeTable = new Table(2);
        employeeTable.addCell(new Cell().add(new Paragraph("Employee ID")));
        employeeTable.addCell(new Cell().add(new Paragraph(String.valueOf(employee.getEmployeeId()))));

        employeeTable.addCell(new Cell().add(new Paragraph("Name")));
        employeeTable.addCell(new Cell().add(new Paragraph(employee.getName())));

        employeeTable.addCell(new Cell().add(new Paragraph("Email")));
        employeeTable.addCell(new Cell().add(new Paragraph(employee.getEmail())));

// thêm các trường khác nếu cần
        document.add(employeeTable);

        document.add(new Paragraph("\n"));

        // Thông tin Room trong Booking
        com.example.demo.model.entity.Room room = booking.getRoom();
        Paragraph roomTitle = new Paragraph("Room Details")
                .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD))
                .setFontSize(14);
        document.add(roomTitle);

        Table roomTable = new Table(2);
        roomTable.addCell(new Cell().add(new Paragraph("Room ID")));
        roomTable.addCell(new Cell().add(new Paragraph(String.valueOf(room.getRoomId()))));

        roomTable.addCell(new Cell().add(new Paragraph("SKU")));
        roomTable.addCell(new Cell().add(new Paragraph(room.getSku())));

        roomTable.addCell(new Cell().add(new Paragraph("Price")));
        roomTable.addCell(new Cell().add(new Paragraph(room.getPrice().toString())));

        roomTable.addCell(new Cell().add(new Paragraph("Status")));
        roomTable.addCell(new Cell().add(new Paragraph(room.getStatus().name())));

        document.add(roomTable);

        // Đóng document
        document.close();
    }
}

