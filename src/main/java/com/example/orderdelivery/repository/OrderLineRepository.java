package com.example.orderdelivery.repository;

import com.example.orderdelivery.entity.OrderLine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderLineRepository extends JpaRepository<OrderLine, Long> {
} 