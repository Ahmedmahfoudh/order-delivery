package com.example.orderdelivery.repository;

import com.example.orderdelivery.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
} 