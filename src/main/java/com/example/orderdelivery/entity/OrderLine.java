package com.example.orderdelivery.entity;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Order order;

    @ManyToOne
    private Product product;

    private Integer quantity;
    @Column(name = "unit_price")
    private Double unitPrice;
} 