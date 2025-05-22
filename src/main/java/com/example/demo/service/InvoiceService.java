package com.example.demo.service;

import com.example.demo.model.InvoiceDto;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public interface InvoiceService {
    InvoiceDto createInvoice(InvoiceDto dto);
    InvoiceDto getInvoiceById(Integer id);
    InvoiceDto updateInvoice(Integer id, InvoiceDto dto);
    void deleteInvoice(Integer id);
    List<InvoiceDto> getAllInvoices();

//    void exportInvoicePdfById(HttpServletResponse response, Integer invoiceId) throws IOException;
}
