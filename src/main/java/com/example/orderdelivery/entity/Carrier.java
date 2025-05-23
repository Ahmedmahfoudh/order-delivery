package com.example.orderdelivery.entity;

import lombok.*;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Carrier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String note;

    @OneToMany(mappedBy = "carrier")
    private List<Delivery> deliveries;
} 