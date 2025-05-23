package com.example.orderdelivery.entity;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String contactPerson;
    private String email;
    private String phone;
    private String address;
    private String notes;
}
