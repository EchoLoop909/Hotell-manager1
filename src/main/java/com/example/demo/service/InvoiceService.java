package com.example.demo.service;

import com.example.demo.model.InvoiceDto;
import org.springframework.http.ResponseEntity;

public interface InvoiceService {
    ResponseEntity<?> createInvoice(InvoiceDto invoiceDto);
}
