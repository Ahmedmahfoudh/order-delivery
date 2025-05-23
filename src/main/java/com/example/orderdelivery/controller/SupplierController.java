package com.example.orderdelivery.controller;

import com.example.orderdelivery.entity.Order;
import com.example.orderdelivery.entity.Product;
import com.example.orderdelivery.entity.Supplier;
import com.example.orderdelivery.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {
    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        try {
            Supplier supplier = supplierService.getSupplierById(id);
            return ResponseEntity.ok(supplier);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Supplier> createSupplier(@RequestBody Supplier supplier) {
        try {
            Supplier createdSupplier = supplierService.createSupplier(supplier);
            return ResponseEntity.ok(createdSupplier);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplier) {
        try {
            Supplier updatedSupplier = supplierService.updateSupplier(id, supplier);
            return ResponseEntity.ok(updatedSupplier);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        try {
            supplierService.deleteSupplier(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search")
    public List<Supplier> searchSuppliersByName(@RequestParam String name) {
        return supplierService.searchSuppliersByName(name);
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<List<Order>> getOrdersBySupplier(@PathVariable Long id) {
        try {
            List<Order> orders = supplierService.getOrdersBySupplier(id);
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/revenue")
    public ResponseEntity<Map<String, Double>> getTotalRevenueBySupplier(@PathVariable Long id) {
        try {
            double revenue = supplierService.getTotalRevenueBySupplier(id);
            return ResponseEntity.ok(Map.of("totalRevenue", revenue));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/products/{productId}/assign")
    public ResponseEntity<Product> assignSupplierToProduct(
            @PathVariable Long productId,
            @RequestParam Long supplierId) {
        try {
            Product product = supplierService.assignSupplierToProduct(productId, supplierId);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
