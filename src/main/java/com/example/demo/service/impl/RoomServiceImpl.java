package com.example.demo.service.impl;

import com.example.demo.model.RoomDto;
import com.example.demo.model.entity.Room;
import com.example.demo.model.entity.RoomType;
import com.example.demo.model.entity.RoomStatus;
import com.example.demo.repository.RoomRepository;
import com.example.demo.repository.RoomTypeRepository;
import com.example.demo.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private static final Logger logger = LoggerFactory.getLogger(RoomServiceImpl.class);

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;

    @Override
    @PreAuthorize("hasAuthority('QUAN_LY')")
    public ResponseEntity<RoomDto> createRoom(RoomDto roomDto) {
        try {
            // Kiểm tra mã phòng trùng
            Optional<Room> roomBySku = roomRepository.findBySku(roomDto.getSku());
            if (roomBySku.isPresent()) {
                logger.warn("Mã phòng {} đã tồn tại", roomDto.getSku());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new RoomDto());
            }

            // Kiểm tra loại phòng tồn tại
            RoomType roomType = roomTypeRepository.findById(roomDto.getTypeId())
                    .orElseThrow(() -> new IllegalArgumentException("Loại phòng không tồn tại"));

            // Kiểm tra dữ liệu
            if (roomDto.getSku() == null || roomDto.getSku().trim().isEmpty()) {
                throw new IllegalArgumentException("Mã phòng không được để trống");
            }
            if (roomDto.getPrice() == null || roomDto.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Giá phòng phải lớn hơn 0");
            }

            // Tạo Room
            Room room = new Room();
            room.setSku(roomDto.getSku().trim());
            room.setType(roomType);
            room.setPrice(roomDto.getPrice());
            room.setStatus(RoomStatus.valueOf("trống"));
            room.setImageUrl(roomDto.getImageUrl());
            // Lưu Room
            Room savedRoom = roomRepository.save(room);

            // Tạo RoomDto trả về
            RoomDto result = new RoomDto();
            result.setRoomId(savedRoom.getRoomId());
            result.setSku(savedRoom.getSku());
            result.setTypeId(savedRoom.getType().getTypeId());
            result.setPrice(savedRoom.getPrice());
            result.setStatus(RoomStatus.valueOf("trống"));

            logger.info("Tạo phòng {} thành công", savedRoom.getSku());
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            logger.error("Lỗi khi tạo phòng: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new RoomDto());
        } catch (Exception e) {
            logger.error("Lỗi hệ thống khi tạo phòng: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RoomDto());
        }
    }

    @Override
//    @PreAuthorize("hasAuthority('QUAN_LY')")
    public ResponseEntity<List<RoomDto>> getAllRooms() {
        try {
            List<RoomDto> rooms = roomRepository.findAll().stream().map(room -> {
                RoomDto dto = new RoomDto();
                dto.setRoomId(room.getRoomId());
                dto.setSku(room.getSku());
                dto.setTypeId(room.getType().getTypeId());
                dto.setPrice(room.getPrice());
                dto.setStatus(room.getStatus());
                return dto;
            }).collect(Collectors.toList());
            logger.info("Lấy danh sách {} phòng thành công", rooms.size());
            return new ResponseEntity<>(rooms, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Lỗi khi lấy danh sách phòng: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of());
        }
    }

    @Override
//    @PreAuthorize("hasAuthority('QUAN_LY')")
    public ResponseEntity<RoomDto> getRoomById(int id) {
        try {
            Room room = roomRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Phòng không tồn tại"));
            RoomDto dto = new RoomDto();
            dto.setRoomId(room.getRoomId());
            dto.setSku(room.getSku());
            dto.setTypeId(room.getType().getTypeId());
            dto.setPrice(room.getPrice());
            dto.setStatus(room.getStatus());
            logger.info("Lấy thông tin phòng {} thành công", room.getSku());
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            logger.error("Lỗi khi lấy phòng: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new RoomDto());
        } catch (Exception e) {
            logger.error("Lỗi hệ thống khi lấy phòng: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RoomDto());
        }
    }

    @Override
    public ResponseEntity<RoomDto> updateRoom(int id, RoomDto roomDto) {
        try {
            Room room = roomRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Phòng không tồn tại"));

            // Kiểm tra mã phòng trùng (nếu thay đổi sku)
            if (!room.getSku().equals(roomDto.getSku())) {
                Optional<Room> roomBySku = roomRepository.findBySku(roomDto.getSku());
                if (roomBySku.isPresent()) {
                    logger.warn("Mã phòng {} đã tồn tại", roomDto.getSku());
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(new RoomDto());
                }
            }

            // Kiểm tra loại phòng
            RoomType roomType = roomTypeRepository.findById(roomDto.getTypeId())
                    .orElseThrow(() -> new IllegalArgumentException("Loại phòng không tồn tại"));

            // Kiểm tra dữ liệu
            if (roomDto.getSku() == null || roomDto.getSku().trim().isEmpty()) {
                throw new IllegalArgumentException("Mã phòng không được để trống");
            }
            if (roomDto.getPrice() == null || roomDto.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Giá phòng phải lớn hơn 0");
            }
            if (roomDto.getStatus() == null) {
                throw new IllegalArgumentException("Trạng thái phòng không được để trống");
            }

            // Cập nhật Room
            room.setSku(roomDto.getSku().trim());
            room.setType(roomType);
            room.setPrice(roomDto.getPrice());
            room.setStatus(roomDto.getStatus());

            // Lưu Room
            Room updatedRoom = roomRepository.save(room);

            // Tạo RoomDto trả về
            RoomDto result = new RoomDto();
            result.setRoomId(updatedRoom.getRoomId());
            result.setSku(updatedRoom.getSku());
            result.setTypeId(updatedRoom.getType().getTypeId());
            result.setPrice(updatedRoom.getPrice());
            result.setStatus(updatedRoom.getStatus());

            logger.info("Cập nhật phòng {} thành công", updatedRoom.getSku());
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            logger.error("Lỗi khi cập nhật phòng: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new RoomDto());
        } catch (Exception e) {
            logger.error("Lỗi hệ thống khi cập nhật phòng: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RoomDto());
        }
    }

    @Override
    public ResponseEntity<Void> deleteRoom(int id) {
        try {
            Room room = roomRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Phòng không tồn tại"));

            // Kiểm tra trạng thái phòng
            if (room.getStatus() == RoomStatus.đã_đặt) {
                throw new IllegalArgumentException("Không thể xóa phòng đang được đặt");
            }

            roomRepository.delete(room);
            logger.info("Xóa phòng {} thành công", room.getSku());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            logger.error("Lỗi khi xóa phòng: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            logger.error("Lỗi hệ thống khi xóa phòng: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<List<RoomDto>> searchAvailableRooms(LocalDate checkIn, LocalDate checkOut, Integer roomTypeId) {
        try {
            if (checkIn == null || checkOut == null || !checkOut.isAfter(checkIn)) {
                return ResponseEntity.badRequest().body(List.of());
            }
            List<Room> rooms = roomRepository.findAvailableRooms(checkIn, checkOut, roomTypeId);

            List<RoomDto> dtos = rooms.stream().map(room -> {
                RoomDto dto = new RoomDto();
                dto.setRoomId(room.getRoomId());
                dto.setSku(room.getSku());
                dto.setTypeId(room.getType().getTypeId());
                dto.setPrice(room.getPrice());
                dto.setStatus(room.getStatus());
                return dto;
            }).collect(Collectors.toList());

            if (dtos.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(dtos);
            }

            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            logger.error("Lỗi tìm phòng trống: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }

}