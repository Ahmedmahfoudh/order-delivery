package com.example.orderdelivery.repository;

import com.example.orderdelivery.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    /**
     * Find products by category
     * @param category The category
     * @return List of products in the category
     */
    List<Product> findByCategory(String category);
    
    /**
     * Find products by name containing the search term (case insensitive)
     * @param name The search term
     * @return List of matching products
     */
    List<Product> findByNameContainingIgnoreCase(String name);
}