package com.example.demo.repository;

import com.example.demo.model.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    Optional<Invoice> findByInvoiceId(Integer id);

    @Query("SELECT i FROM Invoice i WHERE i.booking.customer.customerId = :customerId")
    List<Invoice> findByCustomerId(@Param("customerId") Integer customerId);

    List<Invoice> findByBookingCustomerCustomerId(Integer customerId);

}
