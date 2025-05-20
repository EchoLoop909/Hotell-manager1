package com.example.demo.service.impl;

import com.example.demo.model.InvoiceDto;
import com.example.demo.service.InvoiceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class InvoiceServiceIpml implements InvoiceService {

    private static final Logger logger = LoggerFactory.getLogger(InvoiceServiceIpml.class);

    @Override
    public ResponseEntity<?> createInvoice(InvoiceDto invoiceDto) {
        try{
            return null;
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new InvoiceDto());
        }
    }

}
