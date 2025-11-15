package com.examly.springapp.dto;

public class CustomerStatusDto {
    private Long customerId;
    private String name;
    private int totalClaims;
    private int approvedClaims;
    private int rejectedClaims;
    private int pendingClaims;

    public CustomerStatusDto() {}

    public CustomerStatusDto(Long customerId, String name, int total, int approved, int rejected, int pending) {
        this.customerId = customerId;
        this.name = name;
        this.totalClaims = total;
        this.approvedClaims = approved;
        this.rejectedClaims = rejected;
        this.pendingClaims = pending;
    }

    // ✅ Getters & Setters
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getTotalClaims() { return totalClaims; }
    public void setTotalClaims(int totalClaims) { this.totalClaims = totalClaims; }

    public int getApprovedClaims() { return approvedClaims; }
    public void setApprovedClaims(int approvedClaims) { this.approvedClaims = approvedClaims; }

    public int getRejectedClaims() { return rejectedClaims; }
    public void setRejectedClaims(int rejectedClaims) { this.rejectedClaims = rejectedClaims; }

    public int getPendingClaims() { return pendingClaims; }
    public void setPendingClaims(int pendingClaims) { this.pendingClaims = pendingClaims; }
}
