package com.examly.springapp.controller;

import com.examly.springapp.model.Customer;
import com.examly.springapp.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    // Create a new customer
    @PostMapping
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody Customer customer) {
        return new ResponseEntity<>(service.createCustomer(customer), HttpStatus.CREATED);
    }

    // Get all customers
    @GetMapping
    public List<Customer> getAllCustomers() {
        return service.getAllCustomers();
    }

    // Get customer by ID
    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable Long id) {
        return service.getCustomerById(id);
    }


    // Update customer
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody Customer customer
    ) {
        Customer updated = service.updateCustomer(id, customer);
        return ResponseEntity.ok(updated);
    }

    // Delete customer
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        service.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
