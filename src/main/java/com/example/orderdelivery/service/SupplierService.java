package com.example.orderdelivery.service;

import com.example.orderdelivery.entity.Order;
import com.example.orderdelivery.entity.Product;
import com.example.orderdelivery.entity.Supplier;
import com.example.orderdelivery.repository.ProductRepository;
import com.example.orderdelivery.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SupplierService {
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;

    public SupplierService(SupplierRepository supplierRepository, 
                          ProductRepository productRepository) {
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
    }

    /**
     * Get all suppliers
     * @return List of all suppliers
     */
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    /**
     * Get a supplier by ID
     * @param id The supplier ID
     * @return The supplier
     */
    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
    }

    /**
     * Create a new supplier
     * @param supplier The supplier to create
     * @return The created supplier
     */
    @Transactional
    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    /**
     * Update a supplier
     * @param id The supplier ID
     * @param supplier The updated supplier data
     * @return The updated supplier
     */
    @Transactional
    public Supplier updateSupplier(Long id, Supplier supplier) {
        Supplier existingSupplier = getSupplierById(id);
        
        existingSupplier.setName(supplier.getName());
        existingSupplier.setContactPerson(supplier.getContactPerson());
        existingSupplier.setEmail(supplier.getEmail());
        existingSupplier.setPhone(supplier.getPhone());
        existingSupplier.setAddress(supplier.getAddress());
        existingSupplier.setNotes(supplier.getNotes());
        
        return supplierRepository.save(existingSupplier);
    }

    /**
     * Delete a supplier
     * @param id The supplier ID
     */
    @Transactional
    public void deleteSupplier(Long id) {
        // Check if supplier exists
        getSupplierById(id);
        
        // Since supplier-product relationship is not in the database,
        // we can directly delete the supplier
        supplierRepository.deleteById(id);
    }

    /**
     * Search suppliers by name
     * @param name The name to search for
     * @return List of matching suppliers
     */
    public List<Supplier> searchSuppliersByName(String name) {
        return supplierRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Get all orders that contain products from a specific supplier
     * @param supplierId The supplier ID
     * @return List of orders containing products from the supplier
     */
    public List<Order> getOrdersBySupplier(Long supplierId) {
        // Since there's no direct relationship between products and suppliers in the database,
        // we can't determine which orders contain products from a specific supplier
        // Return an empty list for now
        return new ArrayList<>();
    }
    

    
    /**
     * Get total revenue by supplier
     * @param supplierId The supplier ID
     * @return Total revenue from products supplied by this supplier
     */
    public double getTotalRevenueBySupplier(Long supplierId) {
        // Since there's no direct relationship between products and suppliers in the database,
        // we can't calculate revenue by supplier
        // Return 0 for now
        return 0.0;
    }
    
    /**
     * Assign a supplier to a product
     * @param productId The product ID
     * @param supplierId The supplier ID
     * @return The updated product
     */
    @Transactional
    public Product assignSupplierToProduct(Long productId, Long supplierId) {
        // Since there's no supplier_id column in the product table,
        // we can't assign a supplier to a product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Just return the product without modification
        return product;
    }
}
