package com.example.demo.service;

import com.example.demo.model.InvoiceDto;

import java.util.List;

public interface InvoiceService {
    InvoiceDto createInvoice(InvoiceDto dto);
    InvoiceDto getInvoiceById(Integer id);
    InvoiceDto updateInvoice(Integer id, InvoiceDto dto);
    void deleteInvoice(Integer id);
    List<InvoiceDto> getAllInvoices();
}
