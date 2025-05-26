package com.example.demo.repository;

import com.example.demo.model.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {
    Optional<Room> findBySku(String sku);
    @Query("""
    SELECT r FROM Room r 
    WHERE r.status = 'trống'
      AND (:roomTypeId IS NULL OR r.type.typeId = :roomTypeId)
      AND r.roomId NOT IN (
          SELECT b.room.roomId FROM Booking b 
          WHERE NOT (b.checkOut <= :checkIn OR b.checkIn >= :checkOut)
      )
""")
    List<Room> findAvailableRooms(
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut,
            @Param("roomTypeId") Integer roomTypeId
    );

}