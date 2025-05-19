package com.example.demo.service.impl;

import com.example.demo.model.ServiceDto;
import com.example.demo.repository.ServiceRepository;
import com.example.demo.service.ServiceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ServiceServiceIpml implements ServiceService {

    private static final Logger logger = LoggerFactory.getLogger(ServiceServiceIpml.class);

    @Autowired
    private ServiceRepository serviceRepository;

    @Override
    public ResponseEntity<?> createService(ServiceDto serviceDto) {
        try {
            com.example.demo.model.entity.Service servicename = serviceRepository.findByName(serviceDto.getName());
            if (servicename != null){
                return ResponseEntity.badRequest().body("Ten dich vu da ton tai");
            }

            com.example.demo.model.entity.Service service = new com.example.demo.model.entity.Service();

            service.setDescription(serviceDto.getDescription());
            service.setName(serviceDto.getName());
            service.setPrice(serviceDto.getPrice());

            serviceRepository.save(service);

            return ResponseEntity.status(HttpStatus.CREATED).body(service);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lỗi không mong muốn");
        }
    }

    @Override
    public ResponseEntity<?> getService(String name, String description, BigDecimal price){
        try{
            if ((name == null || name.isBlank()) &&
                    (description == null || description.isBlank()) &&
                    price == null) {

                List<com.example.demo.model.entity.Service> allServices = serviceRepository.findAll();
                return ResponseEntity.ok(allServices);
            }
            // Tính khoảng giá: cho phép tìm gần đúng ±10% nếu không có khoảng cụ thể
            BigDecimal minPrice = (price != null) ? price.multiply(BigDecimal.valueOf(0.9)) : null;
            BigDecimal maxPrice = (price != null) ? price.multiply(BigDecimal.valueOf(1.1)) : null;

            List<com.example.demo.model.entity.Service> services = serviceRepository.searchServices(name, description, minPrice, maxPrice);
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lỗi không mong muốn");
        }
    }

    @Override
    public ResponseEntity<?> deleteService(Integer id) {
        try {
            if (!serviceRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy dịch vụ với ID: " + id);
            }
            serviceRepository.deleteById(id);
            return ResponseEntity.ok("Xóa dịch vụ thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi xóa dịch vụ");
        }
    }

    @Override
    public ResponseEntity<?> updateService(ServiceDto dto) {
        try {
            var optional = serviceRepository.findById(dto.getId());
            if (optional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy dịch vụ để cập nhật");
            }

            var service = optional.get();
            service.setName(dto.getName());
            service.setDescription(dto.getDescription());
            service.setPrice(dto.getPrice());

            serviceRepository.save(service);
            return ResponseEntity.ok("Cập nhật dịch vụ thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi cập nhật dịch vụ");
        }
    }

}
