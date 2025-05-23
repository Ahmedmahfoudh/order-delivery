package com.example.orderdelivery.entity;

import lombok.*;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String address;

    @OneToMany(mappedBy = "customer")
    private List<Order> orders;
} 