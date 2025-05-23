package com.example.orderdelivery.service;

import com.example.orderdelivery.entity.Order;
import com.example.orderdelivery.entity.OrderLine;
import com.example.orderdelivery.entity.Product;
import com.example.orderdelivery.repository.OrderRepository;
import com.example.orderdelivery.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for managing inventory and generating inventory reports
 */
@Service
public class InventoryService {
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public InventoryService(ProductRepository productRepository, OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    /**
     * Get all products with their current stock levels
     * @return List of all products
     */
    public List<Product> getAllProductsWithStock() {
        return productRepository.findAll();
    }

    /**
     * Get products with low stock (below threshold)
     * @param threshold The minimum stock level
     * @return List of products with stock below threshold
     */
    public List<Product> getProductsWithLowStock(int threshold) {
        return productRepository.findAll().stream()
                .filter(product -> product.getStock() < threshold)
                .collect(Collectors.toList());
    }

    /**
     * Get products that are out of stock
     * @return List of products with zero stock
     */
    public List<Product> getOutOfStockProducts() {
        return productRepository.findAll().stream()
                .filter(product -> product.getStock() <= 0)
                .collect(Collectors.toList());
    }

    /**
     * Get the total value of inventory (sum of price * stock for all products)
     * @return Total inventory value
     */
    public double getTotalInventoryValue() {
        return productRepository.findAll().stream()
                .mapToDouble(product -> product.getPrice() * product.getStock())
                .sum();
    }

    /**
     * Get inventory movement for a specific product within a date range
     * @param productId The product ID
     * @param startDate The start date
     * @param endDate The end date
     * @return Map with dates as keys and quantity changes as values
     */
    public Map<LocalDate, Integer> getProductMovement(Long productId, LocalDate startDate, LocalDate endDate) {
        // Validate that the product exists
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found");
        }

        // Get all orders within the date range
        List<Order> orders = orderRepository.findByDateBetween(startDate, endDate);

        // Create a map to store the movement by date
        Map<LocalDate, Integer> movement = new HashMap<>();

        // Process each order
        for (Order order : orders) {
            for (OrderLine line : order.getOrderLines()) {
                if (line.getProduct().getId().equals(productId)) {
                    // Subtract from inventory for regular orders
                    int quantity = -line.getQuantity();
                    
                    // For cancelled orders, add back to inventory
                    if (order.getStatus().toString().equals("CANCELLED")) {
                        quantity = line.getQuantity();
                    }
                    
                    // Add to the movement map
                    movement.put(order.getDate(), 
                            movement.getOrDefault(order.getDate(), 0) + quantity);
                }
            }
        }

        return movement;
    }

    /**
     * Update product stock
     * @param productId The product ID
     * @param newStock The new stock level
     * @return The updated product
     */
    @Transactional
    public Product updateProductStock(Long productId, int newStock) {
        if (newStock < 0) {
            throw new RuntimeException("Stock cannot be negative");
        }
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setStock(newStock);
        return productRepository.save(product);
    }
}
