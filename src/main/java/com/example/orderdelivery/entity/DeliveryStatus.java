package com.example.orderdelivery.entity;

public enum DeliveryStatus {
    PENDING,        // Delivery is created but not assigned
    ASSIGNED,       // Delivery is assigned to a carrier
    PICKED_UP,      // Carrier has picked up the order
    IN_TRANSIT,     // Order is being delivered
    DELIVERED,      // Order has been delivered
    FAILED          // Delivery failed (e.g., customer not available)
} 