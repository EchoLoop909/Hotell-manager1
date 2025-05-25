package com.example.demo.controller;

import com.example.demo.model.InvoiceDto;
import com.example.demo.service.InvoiceService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping("/create")
    public ResponseEntity<InvoiceDto> create(@RequestBody InvoiceDto dto) {
        InvoiceDto created = invoiceService.createInvoice(dto);
        return ResponseEntity.status(201).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceDto> getById(@PathVariable Integer id) {
        InvoiceDto dto = invoiceService.getInvoiceById(id);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvoiceDto> update(@PathVariable Integer id,
                                             @RequestBody InvoiceDto dto) {
        InvoiceDto updated = invoiceService.updateInvoice(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<InvoiceDto>> getAll() {
        List<InvoiceDto> list = invoiceService.getAllInvoices();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/export/{id}")
    public void exportInvoicePdf(@PathVariable Integer id, HttpServletResponse response) throws IOException {
        invoiceService.exportInvoicePdfById(response, id);
    }
}
