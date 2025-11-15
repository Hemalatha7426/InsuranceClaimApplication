package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
public class Claim {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
@ManyToOne
  @JoinColumn(name = "user_id")
  private User user;
  @ManyToOne
  @JoinColumn(name = "customer_id", nullable = false)
  private Customer customer;
private String fileUrl;
  @NotBlank
  private String claimType;

  @Positive
  private double claimAmount;

  @NotNull
  private LocalDate incidentDate;

  @NotBlank
  private String description;

  private String status;
  private LocalDate submissionDate;

  public Claim() {}

  public Claim(Long id, Customer customer, String claimType, double claimAmount,
         LocalDate incidentDate, String description, String status, LocalDate submissionDate) {
    this.id = id;
    this.customer = customer;
    this.claimType = claimType;
    this.claimAmount = claimAmount;
    this.incidentDate = incidentDate;
    this.description = description;
    this.status = status;
    this.submissionDate = submissionDate;
  }
  public String getFileUrl() {
  return fileUrl;
}

public void setFileUrl(String fileUrl) {
  this.fileUrl = fileUrl;
}

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Customer getCustomer() {
    return customer;
  }

  public void setCustomer(Customer customer) {
    this.customer = customer;
  }

  public String getClaimType() {
    return claimType;
  }

  public void setClaimType(String claimType) {
    this.claimType = claimType;
  }

  public double getClaimAmount() {
    return claimAmount;
  }

  public void setClaimAmount(double claimAmount) {
    this.claimAmount = claimAmount;
  }

  public LocalDate getIncidentDate() {
    return incidentDate;
  }

  public void setIncidentDate(LocalDate incidentDate) {
    this.incidentDate = incidentDate;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public LocalDate getSubmissionDate() {
    return submissionDate;
  }

  public void setSubmissionDate(LocalDate submissionDate) {
    this.submissionDate = submissionDate;
  }
}


