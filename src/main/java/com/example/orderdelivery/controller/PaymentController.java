package com.example.orderdelivery.controller;

import com.example.orderdelivery.entity.Payment;
import com.example.orderdelivery.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Payment createPayment(@RequestBody Payment payment) {
        return paymentService.savePayment(payment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(@PathVariable Long id, @RequestBody Payment payment) {
        if (!paymentService.getPaymentById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        payment.setId(id);
        return ResponseEntity.ok(paymentService.savePayment(payment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        if (!paymentService.getPaymentById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
} 