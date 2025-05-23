package com.example.orderdelivery.repository;

import com.example.orderdelivery.entity.Carrier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarrierRepository extends JpaRepository<Carrier, Long> {
} 