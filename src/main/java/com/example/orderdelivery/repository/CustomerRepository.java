package com.example.orderdelivery.repository;

import com.example.orderdelivery.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
} 