package com.example.orderdelivery.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Order order;

    @ManyToOne
    private Carrier carrier;

    private LocalDate deliveryDate;
    private Double cost;
    
    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;
} 