package com.example.demo.repository;

import com.example.demo.model.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {

    @Query("SELECT rt FROM RoomType rt " +
            "WHERE (:name IS NULL OR LOWER(rt.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "  AND (:description IS NULL OR LOWER(rt.description) LIKE LOWER(CONCAT('%', :description, '%'))) " +
            "  AND (:capacity IS NULL OR rt.capacity >= :capacity) " +
            "  AND (:minPrice IS NULL OR rt.defaultPrice >= :minPrice) " +
            "  AND (:maxPrice IS NULL OR rt.defaultPrice <= :maxPrice)")
    List<RoomType> searchRoomTypes(
            @Param("name") String name,
            @Param("description") String description,
            @Param("capacity") Integer capacity,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice
    );

    Optional<RoomType> findByName(String name);
}
