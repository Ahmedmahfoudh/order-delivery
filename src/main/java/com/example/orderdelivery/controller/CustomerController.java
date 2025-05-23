package com.example.orderdelivery.controller;

import com.example.orderdelivery.entity.Customer;
import com.example.orderdelivery.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerService.saveCustomer(customer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        if (!customerService.getCustomerById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        customer.setId(id);
        return ResponseEntity.ok(customerService.saveCustomer(customer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        if (!customerService.getCustomerById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
} 