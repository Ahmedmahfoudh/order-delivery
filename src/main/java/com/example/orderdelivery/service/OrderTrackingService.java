package com.example.orderdelivery.service;

import com.example.orderdelivery.entity.*;
import com.example.orderdelivery.repository.*;
import com.example.orderdelivery.dto.OrderTrackingDTO;
import com.example.orderdelivery.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderTrackingService {
    private final OrderRepository orderRepository;
    private final DeliveryRepository deliveryRepository;
    private final TrackingHistoryRepository trackingHistoryRepository;

    public OrderTrackingService(
            OrderRepository orderRepository,
            DeliveryRepository deliveryRepository,
            TrackingHistoryRepository trackingHistoryRepository) {
        this.orderRepository = orderRepository;
        this.deliveryRepository = deliveryRepository;
        this.trackingHistoryRepository = trackingHistoryRepository;
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        validateOrderStatusTransition(order.getStatus(), newStatus);
        order.setStatus(newStatus);

        // Create tracking history entry
        TrackingHistory history = new TrackingHistory();
        history.setOrder(order);
        history.setOrderStatus(newStatus);
        history.setTimestamp(LocalDateTime.now());
        history.setDescription("Order status updated to " + newStatus);
        trackingHistoryRepository.save(history);

        // If order is ready for delivery, create delivery record if it doesn't exist
        if (newStatus == OrderStatus.READY_FOR_DELIVERY && order.getDelivery() == null) {
            Delivery delivery = Delivery.builder()
                    .order(order)
                    .status(DeliveryStatus.PENDING)
                    .deliveryDate(LocalDate.now())
                    .build();
            order.setDelivery(delivery);
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Delivery assignCarrier(Long deliveryId, Long carrierId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        if (delivery.getStatus() != DeliveryStatus.PENDING) {
            throw new RuntimeException("Can only assign carrier to pending deliveries");
        }

        Carrier carrier = new Carrier();
        carrier.setId(carrierId);
        delivery.setCarrier(carrier);
        delivery.setStatus(DeliveryStatus.ASSIGNED);

        return deliveryRepository.save(delivery);
    }

    @Transactional
    public Delivery updateDeliveryStatus(Long deliveryId, DeliveryStatus newStatus) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found"));

        validateDeliveryStatusTransition(delivery.getStatus(), newStatus);
        delivery.setStatus(newStatus);

        // Create tracking history entry
        TrackingHistory history = new TrackingHistory();
        history.setOrder(delivery.getOrder());
        history.setDeliveryStatus(newStatus);
        history.setTimestamp(LocalDateTime.now());
        history.setDescription("Delivery status updated to " + newStatus);
        trackingHistoryRepository.save(history);

        // Update order status based on delivery status
        Order order = delivery.getOrder();
        if (newStatus == DeliveryStatus.DELIVERED) {
            order.setStatus(OrderStatus.DELIVERED);
            orderRepository.save(order);
        } else if (newStatus == DeliveryStatus.IN_TRANSIT) {
            order.setStatus(OrderStatus.IN_DELIVERY);
            orderRepository.save(order);
        }

        return deliveryRepository.save(delivery);
    }

    @Transactional(readOnly = true)
    public OrderTrackingDTO getOrderTrackingInfo(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        OrderTrackingDTO trackingInfo = new OrderTrackingDTO();
        trackingInfo.setOrderId(order.getId());
        trackingInfo.setOrderStatus(order.getStatus());
        trackingInfo.setOrderDate(order.getDate());
        trackingInfo.setTotalAmount(order.getTotalAmount());
        
        if (order.getCustomer() != null) {
            trackingInfo.setCustomerName(order.getCustomer().getName());
            trackingInfo.setCustomerAddress(order.getCustomer().getAddress());
        }

        if (order.getDelivery() != null) {
            Delivery delivery = order.getDelivery();
            trackingInfo.setDeliveryId(delivery.getId());
            trackingInfo.setDeliveryStatus(delivery.getStatus());
            trackingInfo.setDeliveryDate(delivery.getDeliveryDate());
            
            if (delivery.getCarrier() != null) {
                trackingInfo.setCarrierName(delivery.getCarrier().getName());
                trackingInfo.setCarrierPhone(delivery.getCarrier().getPhone());
            }
        }

        return trackingInfo;
    }

    @Transactional(readOnly = true)
    public List<TrackingHistory> getOrderTrackingHistory(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new ResourceNotFoundException("Order not found");
        }
        return trackingHistoryRepository.findByOrderIdOrderByTimestampDesc(orderId);
    }

    private void validateOrderStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        if (currentStatus == null) {
            return; // Allow initial status
        }

        switch (currentStatus) {
            case PENDING:
                if (newStatus != OrderStatus.CONFIRMED && newStatus != OrderStatus.CANCELLED) {
                    throw new RuntimeException("Invalid status transition from PENDING");
                }
                break;
            case CONFIRMED:
                if (newStatus != OrderStatus.PROCESSING && newStatus != OrderStatus.CANCELLED) {
                    throw new RuntimeException("Invalid status transition from CONFIRMED");
                }
                break;
            case PROCESSING:
                if (newStatus != OrderStatus.READY_FOR_DELIVERY && newStatus != OrderStatus.CANCELLED) {
                    throw new RuntimeException("Invalid status transition from PROCESSING");
                }
                break;
            case READY_FOR_DELIVERY:
                if (newStatus != OrderStatus.IN_DELIVERY && newStatus != OrderStatus.CANCELLED) {
                    throw new RuntimeException("Invalid status transition from READY_FOR_DELIVERY");
                }
                break;
            case IN_DELIVERY:
                if (newStatus != OrderStatus.DELIVERED && newStatus != OrderStatus.CANCELLED) {
                    throw new RuntimeException("Invalid status transition from IN_DELIVERY");
                }
                break;
            case DELIVERED:
            case CANCELLED:
                throw new RuntimeException("Cannot change status from " + currentStatus);
        }
    }

    private void validateDeliveryStatusTransition(DeliveryStatus currentStatus, DeliveryStatus newStatus) {
        if (currentStatus == null) {
            return; // Allow initial status
        }

        switch (currentStatus) {
            case PENDING:
                if (newStatus != DeliveryStatus.ASSIGNED) {
                    throw new RuntimeException("Invalid status transition from PENDING");
                }
                break;
            case ASSIGNED:
                if (newStatus != DeliveryStatus.PICKED_UP) {
                    throw new RuntimeException("Invalid status transition from ASSIGNED");
                }
                break;
            case PICKED_UP:
                if (newStatus != DeliveryStatus.IN_TRANSIT) {
                    throw new RuntimeException("Invalid status transition from PICKED_UP");
                }
                break;
            case IN_TRANSIT:
                if (newStatus != DeliveryStatus.DELIVERED && newStatus != DeliveryStatus.FAILED) {
                    throw new RuntimeException("Invalid status transition from IN_TRANSIT");
                }
                break;
            case DELIVERED:
            case FAILED:
                throw new RuntimeException("Cannot change status from " + currentStatus);
        }
    }
} 