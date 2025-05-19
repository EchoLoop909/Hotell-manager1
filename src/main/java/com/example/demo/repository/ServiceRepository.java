package com.example.demo.repository;

import com.example.demo.model.ServiceDto;
import com.example.demo.model.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Integer> {
    Service findByName(String name);

    @Query("SELECT s FROM Service s " +
            "WHERE (:name IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "  AND (:description IS NULL OR LOWER(s.description) LIKE LOWER(CONCAT('%', :description, '%'))) " +
            "  AND (:minPrice IS NULL OR s.price >= :minPrice) " +
            "  AND (:maxPrice IS NULL OR s.price <= :maxPrice)")
    List<Service> searchServices(
            @Param("name") String name,
            @Param("description") String description,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice
    );
}
