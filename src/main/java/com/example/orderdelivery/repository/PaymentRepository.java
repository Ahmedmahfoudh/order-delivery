package com.example.orderdelivery.repository;

import com.example.orderdelivery.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
} 