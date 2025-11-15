package com.examly.springapp.service;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.exception.ValidationException;
import com.examly.springapp.model.Claim;
import com.examly.springapp.model.Customer;
import com.examly.springapp.model.ClaimStatus;
import com.examly.springapp.repository.ClaimRepository;
import com.examly.springapp.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository claimRepo;
    private final CustomerRepository customerRepo;
    private final NotificationService notificationService;
    private final SmsService smsService;

    public ClaimServiceImpl(ClaimRepository claimRepo, CustomerRepository customerRepo, NotificationService notificationService,SmsService smsService) {
        this.claimRepo = claimRepo;
        this.customerRepo = customerRepo;
     this.notificationService = notificationService;
     this.smsService = smsService;
    }

    @Override
    public Claim submitClaim(Claim claim) {
        Customer customer = customerRepo.findById(claim.getCustomer().getCustomerId())
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        claim.setCustomer(customer);
        claim.setStatus(ClaimStatus.SUBMITTED.name());
        claim.setSubmissionDate(LocalDate.now());
        return claimRepo.save(claim);
    }

    @Override
    public List<Claim> getAllClaims() {
        return claimRepo.findAll();
    }

    @Override
    public Claim getClaimById(Long id) {
        return claimRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
    }

    @Override
    public List<Claim> getClaimsByCustomerId(Long customerId) {
        return claimRepo.findByCustomerCustomerId(customerId);
    }

    @Override
    public Claim updateClaimStatus(Long claimId, String status) {
        try {
            ClaimStatus.valueOf(status); // Validate enum
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Invalid claim status: " + status);
        }

        Claim claim = getClaimById(claimId);
        claim.setStatus(status);
        Claim updatedClaim = claimRepo.save(claim);

        // 📩 Send Notification Email
    String customerEmail = updatedClaim.getCustomer().getEmail();
    String message = (status.equalsIgnoreCase("APPROVED"))
            ? "Amount will be credited in 3-5 business days."
            : (status.equalsIgnoreCase("REJECTED"))
                ? "Your claim has been rejected. Please contact support for more details."
                : "Your claim status has been updated.";

    notificationService.sendClaimStatusEmail(
            customerEmail,
            String.valueOf(updatedClaim.getId()),
            status,
            message
    );

    return updatedClaim;

    }

    // @Override
    // public List<Claim> getClaimsByUserId(Long userId) {
    //     Customer customer = customerRepo.findByUser_Id(userId)
    //         .orElseThrow(() -> new RuntimeException("Customer not found for userId " + userId));
    //     return claimRepo.findByCustomerCustomerId(customer.getCustomerId());
    // }
@Override
public List<Claim> getClaimsByUserId(Long userId) {
    Customer customer = customerRepo.findByUser_Id(userId)
        .orElseThrow(() -> new RuntimeException("Customer not found for userId " + userId));
    System.out.println("Customer found: " + customer.getName());
    List<Claim> claims = claimRepo.findByCustomerCustomerId(customer.getCustomerId());
    System.out.println("Claims found: " + claims.size());
    return claims;
}

   @Override
public Claim approveClaim(Long id) {
    Claim claim = getClaimById(id);
    
    // Set status to APPROVED
    claim.setStatus(ClaimStatus.APPROVED.name());
    Claim updatedClaim = claimRepo.save(claim);

    String customerEmail = updatedClaim.getCustomer().getEmail();
    String phone = updatedClaim.getCustomer().getPhone(); // Ensure Customer entity has phone
    String status = ClaimStatus.APPROVED.name(); // ✅ Define status variable here
    String message = switch(status) {
        case "APPROVED" -> "Amount will be credited in 3-5 business days.";
        case "REJECTED" -> "Your claim has been rejected. Please contact support.";
        default -> "Your claim status has been updated.";
    };

    // Send email
    notificationService.sendClaimStatusEmail(
        customerEmail,
        String.valueOf(updatedClaim.getId()),
        status,
        message
    );

    // Send SMS
    if (phone != null && !phone.isEmpty()) {
        smsService.sendSms(phone, "Claim #" + updatedClaim.getId() + " status: " + status);
    }

    return updatedClaim;
}


}
