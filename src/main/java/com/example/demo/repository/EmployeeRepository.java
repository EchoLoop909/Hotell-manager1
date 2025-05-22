package com.example.demo.repository;

import com.example.demo.model.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByRefreshToken(String refreshToken);
    @Query("SELECT e FROM Employee e " +
            "WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%')) " +
            "AND LOWER(e.email) LIKE LOWER(CONCAT('%', :email, '%')) " +
            "AND (:role IS NULL OR e.employeeRole = :role)")
    List<Employee> searchByNameEmailRole(@Param("name") String name,
                                         @Param("email") String email,
                                         @Param("role") Employee.EmployeeRole role);

}