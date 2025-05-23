package com.example.orderdelivery.entity;

import lombok.*;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String category;

    @OneToMany(mappedBy = "product")
    private List<OrderLine> orderLines;
}