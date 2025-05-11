package com.example.demo.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode(of = "roomId")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int roomId;

    @Column(nullable = false, unique = true)
    private String sku;

    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private RoomType type;

    @Column(nullable = false)
    private BigDecimal price;
}