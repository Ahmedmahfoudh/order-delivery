package com.example.orderdelivery.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Customer customer;

    private LocalDate date;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    private Double totalAmount;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderLine> orderLines;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private Delivery delivery;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private Payment payment;
} 