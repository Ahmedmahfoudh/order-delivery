package com.example.orderdelivery.controller;

import com.example.orderdelivery.entity.*;
import com.example.orderdelivery.service.OrderTrackingService;
import com.example.orderdelivery.dto.OrderTrackingDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracking")
@CrossOrigin(origins = "*")
public class OrderTrackingController {
    private final OrderTrackingService orderTrackingService;

    public OrderTrackingController(OrderTrackingService orderTrackingService) {
        this.orderTrackingService = orderTrackingService;
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderTrackingDTO> getOrderTrackingInfo(@PathVariable Long orderId) {
        try {
            OrderTrackingDTO trackingInfo = orderTrackingService.getOrderTrackingInfo(orderId);
            return ResponseEntity.ok(trackingInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/orders/{orderId}/history")
    public ResponseEntity<List<TrackingHistory>> getOrderTrackingHistory(@PathVariable Long orderId) {
        try {
            List<TrackingHistory> history = orderTrackingService.getOrderTrackingHistory(orderId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.ok(java.util.Collections.emptyList());
        }
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        try {
            Order updatedOrder = orderTrackingService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/deliveries/{deliveryId}/assign")
    public ResponseEntity<Delivery> assignCarrier(
            @PathVariable Long deliveryId,
            @RequestParam Long carrierId) {
        try {
            Delivery updatedDelivery = orderTrackingService.assignCarrier(deliveryId, carrierId);
            return ResponseEntity.ok(updatedDelivery);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/deliveries/{deliveryId}/status")
    public ResponseEntity<Delivery> updateDeliveryStatus(
            @PathVariable Long deliveryId,
            @RequestParam DeliveryStatus status) {
        try {
            Delivery updatedDelivery = orderTrackingService.updateDeliveryStatus(deliveryId, status);
            return ResponseEntity.ok(updatedDelivery);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 