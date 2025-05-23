package com.example.orderdelivery.repository;

import com.example.orderdelivery.entity.TrackingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrackingHistoryRepository extends JpaRepository<TrackingHistory, Long> {
    List<TrackingHistory> findByOrderIdOrderByTimestampDesc(Long orderId);
} 