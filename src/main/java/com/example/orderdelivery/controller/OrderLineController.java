package com.example.orderdelivery.controller;

import com.example.orderdelivery.entity.OrderLine;
import com.example.orderdelivery.service.OrderLineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orderlines")
@CrossOrigin(origins = "*")
public class OrderLineController {
    private final OrderLineService orderLineService;

    public OrderLineController(OrderLineService orderLineService) {
        this.orderLineService = orderLineService;
    }

    @GetMapping
    public List<OrderLine> getAllOrderLines() {
        return orderLineService.getAllOrderLines();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderLine> getOrderLineById(@PathVariable Long id) {
        return orderLineService.getOrderLineById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public OrderLine createOrderLine(@RequestBody OrderLine orderLine) {
        return orderLineService.saveOrderLine(orderLine);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderLine> updateOrderLine(@PathVariable Long id, @RequestBody OrderLine orderLine) {
        if (!orderLineService.getOrderLineById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        orderLine.setId(id);
        return ResponseEntity.ok(orderLineService.saveOrderLine(orderLine));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderLine(@PathVariable Long id) {
        if (!orderLineService.getOrderLineById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        orderLineService.deleteOrderLine(id);
        return ResponseEntity.noContent().build();
    }
} 