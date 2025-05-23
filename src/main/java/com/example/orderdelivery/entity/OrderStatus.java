package com.example.orderdelivery.entity;

public enum OrderStatus {
    PENDING,        // Initial state when order is created
    CONFIRMED,      // Order is confirmed and payment is received
    PROCESSING,     // Order is being processed
    READY_FOR_DELIVERY, // Order is ready to be picked up by carrier
    IN_DELIVERY,    // Order is being delivered
    DELIVERED,      // Order has been delivered
    CANCELLED      // Order has been cancelled
} 