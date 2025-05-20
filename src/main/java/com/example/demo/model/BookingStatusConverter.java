package com.example.demo.model;

import com.example.demo.model.entity.Booking.BookingStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class BookingStatusConverter implements AttributeConverter<BookingStatus, String> {

    @Override
    public String convertToDatabaseColumn(BookingStatus status) {
        if (status == null) return null;
        return status.getDbValue();
    }

    @Override
    public BookingStatus convertToEntityAttribute(String dbValue) {
        if (dbValue == null) return null;
        return BookingStatus.fromDbValue(dbValue);
    }
}
