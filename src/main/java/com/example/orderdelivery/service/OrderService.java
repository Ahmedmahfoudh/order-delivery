package com.example.orderdelivery.service;

import com.example.orderdelivery.entity.Order;
import com.example.orderdelivery.entity.OrderLine;
import com.example.orderdelivery.entity.Product;
import com.example.orderdelivery.entity.OrderStatus;
import com.example.orderdelivery.repository.OrderRepository;
import com.example.orderdelivery.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Transactional
    public Order createOrder(Order order) {
        // Validate order
        validateOrder(order);
        
        // Set initial values
        order.setDate(LocalDate.now());
        order.setStatus(OrderStatus.PENDING);
        
        // Calculate total amount
        calculateTotalAmount(order);
        
        // Update product stock
        updateProductStock(order);
        
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrder(Long id, Order order) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // If order status is changing to CANCELLED, restore stock
        if (order.getStatus() == OrderStatus.CANCELLED && existingOrder.getStatus() != OrderStatus.CANCELLED) {
            restoreProductStock(existingOrder);
        }
        
        // Update existing order with new values
        existingOrder.setCustomer(order.getCustomer());
        existingOrder.setDate(order.getDate());
        existingOrder.setStatus(order.getStatus());
        
        // Handle order lines changes carefully to manage inventory
        if (order.getOrderLines() != null && !order.getOrderLines().isEmpty()) {
            // First restore stock for existing order lines
            if (existingOrder.getStatus() != OrderStatus.CANCELLED) {
                restoreProductStock(existingOrder);
            }
            
            // Update order lines
            existingOrder.setOrderLines(order.getOrderLines());
            
            // Validate updated order
            validateOrder(existingOrder);
            
            // Calculate total amount
            calculateTotalAmount(existingOrder);
            
            // Update product stock for new order lines
            if (existingOrder.getStatus() != OrderStatus.CANCELLED) {
                updateProductStock(existingOrder);
            }
        }
        
        existingOrder.setDelivery(order.getDelivery());
        existingOrder.setPayment(order.getPayment());
        
        return orderRepository.save(existingOrder);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
    
    /**
     * Cancels an order and restores product stock
     * @param id The order ID to cancel
     * @return The canceled order
     */
    @Transactional
    public Order cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Only allow cancellation of orders that are not already delivered or canceled
        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Cannot cancel an order that is already delivered or canceled");
        }
        
        // Restore product stock
        restoreProductStock(order);
        
        // Update order status
        order.setStatus(OrderStatus.CANCELLED);
        
        return orderRepository.save(order);
    }

    private void validateOrder(Order order) {
        if (order.getCustomer() == null) {
            throw new RuntimeException("Customer is required");
        }
        
        if (order.getOrderLines() == null || order.getOrderLines().isEmpty()) {
            throw new RuntimeException("Order must have at least one order line");
        }
        
        // Validate each order line
        for (OrderLine line : order.getOrderLines()) {
            if (line.getProduct() == null) {
                throw new RuntimeException("Product is required for each order line");
            }
            
            if (line.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be greater than 0");
            }
            
            // Check product availability
            Product product = productRepository.findById(line.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            
            if (product.getStock() < line.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
        }
    }

    private void calculateTotalAmount(Order order) {
        double total = 0.0;
        for (OrderLine line : order.getOrderLines()) {
            Product product = productRepository.findById(line.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            
            line.setUnitPrice(product.getPrice());
            total += line.getUnitPrice() * line.getQuantity();
        }
        order.setTotalAmount(total);
    }

    private void updateProductStock(Order order) {
        for (OrderLine line : order.getOrderLines()) {
            Product product = productRepository.findById(line.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            
            int newStock = product.getStock() - line.getQuantity();
            if (newStock < 0) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            
            product.setStock(newStock);
            productRepository.save(product);
        }
    }
    
    /**
     * Restores product stock when an order is canceled or modified
     * @param order The order containing products to restore stock for
     */
    private void restoreProductStock(Order order) {
        if (order.getOrderLines() == null || order.getOrderLines().isEmpty()) {
            return;
        }
        
        for (OrderLine line : order.getOrderLines()) {
            if (line.getProduct() != null && line.getQuantity() > 0) {
                Product product = productRepository.findById(line.getProduct().getId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));
                
                // Restore the stock
                int restoredStock = product.getStock() + line.getQuantity();
                product.setStock(restoredStock);
                productRepository.save(product);
            }
        }
    }
} 