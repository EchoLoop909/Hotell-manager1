package com.example.demo.service.impl;

import com.example.demo.model.InvoiceDto;
import com.example.demo.model.entity.Booking;
import com.example.demo.model.entity.Invoice;
import com.example.demo.model.entity.Service;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.InvoiceRepository;
import com.example.demo.repository.ServiceRepository;
import com.example.demo.service.InvoiceService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.util.Assert;
import com.itextpdf.layout.Document;

import java.io.IOException;
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


//@Override
//public ByteArrayResource exportPdf(Integer id) throws IOException, SQLException {
//    //Kiểm tra xem category có tồn tại không
//    Optional<Category> categoryOpt = categoryRepository.findById(id);
//    if (!categoryOpt.isPresent()) {
//        throw new RuntimeException("Không tìm thấy ID: " + id);
//    }
//
//    //Lấy tên bảng từ category
//    String tableName ="dmdc_" + categoryRepository.findTableNameByCategoryId(id);
//    if (tableName == null || tableName.trim().isEmpty()) {
//        throw new RuntimeException("Không tìm thấy bảng cho ID: " + id);
//    }
//
//    // Kiểm tra xem bảng có tồn tại trong DB không
//    if (!isTableExists(tableName)) {
//        throw new RuntimeException("Bảng không tồn tại trong DB: " + tableName);
//    }
//
//    //Xuất dữ liệu ra file PDF
//    return exportTableToPdf(tableName);
//}
//
////  Kiểm tra xem bảng có tồn tại trong DB không
//private boolean isTableExists(String tableName) {
//    String sql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
//    Integer count = jdbcTemplate.queryForObject(sql, new Object[]{tableName}, Integer.class);
//    return count != null && count > 0;
//}
//
////  Xuất dữ liệu từ bảng ra file PDF
//private ByteArrayResource exportTableToPdf(String tableName) throws IOException {
//    String sql = "SELECT * FROM " + tableName;
//    List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
//
//    try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
//        Document document = new Document();
//        PdfWriter.getInstance(document, out);
//        document.open();
//
//        com.itextpdf.text.Font titleFont = com.itextpdf.text.FontFactory.getFont(
//                com.itextpdf.text.FontFactory.HELVETICA_BOLD, 16, com.itextpdf.text.BaseColor.BLUE
//        );
//        com.itextpdf.text.Paragraph title = new com.itextpdf.text.Paragraph(tableName, titleFont);
//
//        title.setAlignment(Element.ALIGN_CENTER);
//        document.add(title);
//        document.add(Chunk.NEWLINE);
//
//        if (!rows.isEmpty()) {
//            PdfPTable table = new PdfPTable(rows.get(0).size());
//            table.setWidthPercentage(100);
//
//            // Thêm tiêu đề cột
//            rows.get(0).keySet().forEach(column -> {
//                PdfPCell cell = new PdfPCell(new Phrase(column, FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
//                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
//                table.addCell(cell);
//            });
//
//            // Thêm dữ liệu từ database
//            for (Map<String, Object> row : rows) {
//                row.values().forEach(value -> table.addCell(value != null ? value.toString() : ""));
//            }
//
//            document.add(table);
//        } else {
//            document.add(new Paragraph("Không có dữ liệu trong bảng " + tableName));
//        }
//
//        document.close();
//        return new ByteArrayResource(out.toByteArray());
//    } catch (Exception e) {
//        throw new RuntimeException("Lỗi khi tạo PDF", e);
//    }
//}

