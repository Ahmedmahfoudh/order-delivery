package com.example.orderdelivery.dto;

import com.example.orderdelivery.entity.DeliveryStatus;
import com.example.orderdelivery.entity.OrderStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class OrderTrackingDTO {
    private Long orderId;
    private OrderStatus orderStatus;
    private LocalDate orderDate;
    private Double totalAmount;
    
    private Long deliveryId;
    private DeliveryStatus deliveryStatus;
    private LocalDate deliveryDate;
    private String carrierName;
    private String carrierPhone;
    
    private String customerName;
    private String customerAddress;
} 