package com.example.orderdelivery.controller;

import com.example.orderdelivery.entity.Delivery;
import com.example.orderdelivery.service.DeliveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "*")
public class DeliveryController {
    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping
    public List<Delivery> getAllDeliveries() {
        return deliveryService.getAllDeliveries();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Delivery> getDeliveryById(@PathVariable Long id) {
        return deliveryService.getDeliveryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Delivery createDelivery(@RequestBody Delivery delivery) {
        return deliveryService.saveDelivery(delivery);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Delivery> updateDelivery(@PathVariable Long id, @RequestBody Delivery delivery) {
        if (!deliveryService.getDeliveryById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        delivery.setId(id);
        return ResponseEntity.ok(deliveryService.saveDelivery(delivery));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable Long id) {
        if (!deliveryService.getDeliveryById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        deliveryService.deleteDelivery(id);
        return ResponseEntity.noContent().build();
    }
} 