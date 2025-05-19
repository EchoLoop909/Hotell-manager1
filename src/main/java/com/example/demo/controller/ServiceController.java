package com.example.demo.controller;

import com.example.demo.model.ServiceDto;
import com.example.demo.model.entity.Service;
import com.example.demo.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/Service")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @PostMapping("/create")
    public ResponseEntity<?> createService(@RequestBody ServiceDto serviceDto){
        return serviceService.createService(serviceDto);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchServices(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) BigDecimal price
    ) {
        return serviceService.getService(name, description, price);
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Integer id) {
        return serviceService.deleteService(id);
    }

    @PutMapping("/services")
    public ResponseEntity<?> updateService(@RequestBody ServiceDto dto) {
        return serviceService.updateService(dto);
    }

}
