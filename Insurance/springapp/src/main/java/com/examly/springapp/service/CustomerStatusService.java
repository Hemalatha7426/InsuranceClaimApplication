package com.examly.springapp.service;

import com.examly.springapp.dto.CustomerStatusDto;
import com.examly.springapp.model.Customer;
import com.examly.springapp.model.Claim;
import com.examly.springapp.repository.CustomerRepository;
import com.examly.springapp.repository.ClaimRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerStatusService {

    private final CustomerRepository customerRepo;
    private final ClaimRepository claimRepo;

    public CustomerStatusService(CustomerRepository customerRepo, ClaimRepository claimRepo) {
        this.customerRepo = customerRepo;
        this.claimRepo = claimRepo;
    }

    // ✅ Get status for single customer
    public CustomerStatusDto getStatusByCustomerId(Long customerId) {
        Customer c = customerRepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<Claim> claims = claimRepo.findByCustomerCustomerId(customerId);

        int approved = (int) claims.stream().filter(cl -> "APPROVED".equalsIgnoreCase(cl.getStatus())).count();
        int rejected = (int) claims.stream().filter(cl -> "REJECTED".equalsIgnoreCase(cl.getStatus())).count();
        int pending = (int) claims.stream().filter(cl -> "SUBMITTED".equalsIgnoreCase(cl.getStatus())
                || "UNDER_REVIEW".equalsIgnoreCase(cl.getStatus())).count();
        int total = claims.size();

        return new CustomerStatusDto(customerId, c.getName(), total, approved, rejected, pending);
    }
}
