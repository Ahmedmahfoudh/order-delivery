package com.example.orderdelivery.repository;

import com.example.orderdelivery.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    /**
     * Find orders within a date range
     * @param startDate The start date (inclusive)
     * @param endDate The end date (inclusive)
     * @return List of orders within the date range
     */
    List<Order> findByDateBetween(LocalDate startDate, LocalDate endDate);
}