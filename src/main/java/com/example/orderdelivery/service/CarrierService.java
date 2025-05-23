package com.example.orderdelivery.service;

import com.example.orderdelivery.entity.Carrier;
import com.example.orderdelivery.repository.CarrierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarrierService {
    private final CarrierRepository carrierRepository;

    public CarrierService(CarrierRepository carrierRepository) {
        this.carrierRepository = carrierRepository;
    }

    public List<Carrier> getAllCarriers() {
        return carrierRepository.findAll();
    }

    public Optional<Carrier> getCarrierById(Long id) {
        return carrierRepository.findById(id);
    }

    public Carrier saveCarrier(Carrier carrier) {
        return carrierRepository.save(carrier);
    }

    public void deleteCarrier(Long id) {
        carrierRepository.deleteById(id);
    }
} 