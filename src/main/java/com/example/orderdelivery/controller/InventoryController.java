package com.example.orderdelivery.controller;

import com.example.orderdelivery.entity.Product;
import com.example.orderdelivery.service.InventoryService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping("/products")
    public List<Product> getAllProductsWithStock() {
        return inventoryService.getAllProductsWithStock();
    }

    @GetMapping("/products/low-stock")
    public List<Product> getProductsWithLowStock(@RequestParam(defaultValue = "5") int threshold) {
        return inventoryService.getProductsWithLowStock(threshold);
    }

    @GetMapping("/products/out-of-stock")
    public List<Product> getOutOfStockProducts() {
        return inventoryService.getOutOfStockProducts();
    }

    @GetMapping("/value")
    public ResponseEntity<Map<String, Double>> getTotalInventoryValue() {
        double value = inventoryService.getTotalInventoryValue();
        return ResponseEntity.ok(Map.of("totalValue", value));
    }

    @GetMapping("/products/{productId}/movement")
    public ResponseEntity<Map<LocalDate, Integer>> getProductMovement(
            @PathVariable Long productId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            Map<LocalDate, Integer> movement = inventoryService.getProductMovement(productId, startDate, endDate);
            return ResponseEntity.ok(movement);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/products/{productId}/stock")
    public ResponseEntity<Product> updateProductStock(
            @PathVariable Long productId,
            @RequestParam int stock) {
        try {
            Product product = inventoryService.updateProductStock(productId, stock);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
