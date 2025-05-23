package com.example.orderdelivery.controller;

import com.example.orderdelivery.entity.Carrier;
import com.example.orderdelivery.service.CarrierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carriers")
@CrossOrigin(origins = "*")
public class CarrierController {
    private final CarrierService carrierService;

    public CarrierController(CarrierService carrierService) {
        this.carrierService = carrierService;
    }

    @GetMapping
    public List<Carrier> getAllCarriers() {
        return carrierService.getAllCarriers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Carrier> getCarrierById(@PathVariable Long id) {
        return carrierService.getCarrierById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Carrier createCarrier(@RequestBody Carrier carrier) {
        return carrierService.saveCarrier(carrier);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Carrier> updateCarrier(@PathVariable Long id, @RequestBody Carrier carrier) {
        if (!carrierService.getCarrierById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        carrier.setId(id);
        return ResponseEntity.ok(carrierService.saveCarrier(carrier));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCarrier(@PathVariable Long id) {
        if (!carrierService.getCarrierById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        carrierService.deleteCarrier(id);
        return ResponseEntity.noContent().build();
    }
} 