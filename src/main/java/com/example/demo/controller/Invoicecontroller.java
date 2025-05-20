package com.example.demo.controller;

import com.example.demo.model.InvoiceDto;
import com.example.demo.service.InvoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/invoices")
public class Invoicecontroller {

    private InvoiceService invoiceService;

    public ResponseEntity<?> createInvoice(InvoiceDto invoiceDto){
        return invoiceService.createInvoice(invoiceDto);
    }
}
