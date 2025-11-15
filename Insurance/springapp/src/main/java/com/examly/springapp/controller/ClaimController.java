package com.examly.springapp.controller;

import com.examly.springapp.model.Claim;
import com.examly.springapp.repository.ClaimRepository;
import com.examly.springapp.service.ClaimService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/claims") // Base path for cleaner routes
public class ClaimController {

    private final ClaimService service;

    @Autowired
    private ClaimRepository claimRepository;

    public ClaimController(ClaimService service) {
        this.service = service;
    }

    // Submit a new claim
    @PostMapping
    public ResponseEntity<Claim> submitClaim(@Valid @RequestBody Claim claim) {
        Claim savedClaim = service.submitClaim(claim);
        return new ResponseEntity<>(savedClaim, HttpStatus.CREATED);
    }

    // Get all claims
    @GetMapping
    public List<Claim> getAllClaims() {
        return service.getAllClaims();
    }

    // Get claim by ID
    @GetMapping("/{id}")
    public Claim getClaimById(@PathVariable Long id) {
        return service.getClaimById(id);
    }

    // Get claims by customer ID
    @GetMapping("/customer/{customerId}")
    public List<Claim> getByCustomerId(@PathVariable Long customerId) {
        return service.getClaimsByCustomerId(customerId);
    }



    // Update claim status (generic)
    @PutMapping("/{id}/status")
    public Claim updateClaimStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        return service.updateClaimStatus(id, status);
    }

    // Approve a claim
    @PutMapping("/{id}/approve")
    public ResponseEntity<Claim> approveClaim(@PathVariable Long id) {
        Claim claim = service.updateClaimStatus(id, "APPROVED");
        return ResponseEntity.ok(claim);
    }

    // Reject a claim
    @PutMapping("/{id}/reject")
    public ResponseEntity<Claim> rejectClaim(@PathVariable Long id) {
        Claim claim = service.updateClaimStatus(id, "REJECTED");
        return ResponseEntity.ok(claim);
    }
}
