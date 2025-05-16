package com.example.demo.model.entity;

import java.io.Serializable;
import java.util.Objects;

public class BookingServiceId implements Serializable {
    private int booking;
    private int service;

    // Getters and setters
    public int getBooking() {
        return booking;
    }

    public void setBooking(int booking) {
        this.booking = booking;
    }

    public int getService() {
        return service;
    }

    public void setService(int service) {
        this.service = service;
    }

    // Equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BookingServiceId that = (BookingServiceId) o;
        return booking == that.booking && service == that.service;
    }

    @Override
    public int hashCode() {
        return Objects.hash(booking, service);
    }
}