package com.example.orderdelivery.service;

import com.example.orderdelivery.entity.OrderLine;
import com.example.orderdelivery.repository.OrderLineRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderLineService {
    private final OrderLineRepository orderLineRepository;

    public OrderLineService(OrderLineRepository orderLineRepository) {
        this.orderLineRepository = orderLineRepository;
    }

    public List<OrderLine> getAllOrderLines() {
        return orderLineRepository.findAll();
    }

    public Optional<OrderLine> getOrderLineById(Long id) {
        return orderLineRepository.findById(id);
    }

    public OrderLine saveOrderLine(OrderLine orderLine) {
        return orderLineRepository.save(orderLine);
    }

    public void deleteOrderLine(Long id) {
        orderLineRepository.deleteById(id);
    }
} 