package com.example.orderdelivery.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Order order;

    private LocalDate date;
    private String status;
    private String method;
} 