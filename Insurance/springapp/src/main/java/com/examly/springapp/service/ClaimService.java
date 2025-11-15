package com.examly.springapp.service;

import com.examly.springapp.model.Claim;
import java.util.List;

public interface ClaimService {
  Claim submitClaim(Claim claim);
  List<Claim> getAllClaims();
  Claim getClaimById(Long id);
  List<Claim> getClaimsByCustomerId(Long customerId);
  Claim updateClaimStatus(Long claimId, String status);
  List<Claim> getClaimsByUserId(Long userId);
  Claim approveClaim(Long id);
  
}

