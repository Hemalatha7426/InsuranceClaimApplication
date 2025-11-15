package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
@Entity
public class Customer {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long customerId;

  @NotBlank
  private String name;

  @NotBlank
  @Email
  private String email;

  @NotBlank
  private String phone;

  @NotBlank
  private String policyNumber;

  @OneToOne
  @JoinColumn(name = "user_id", referencedColumnName = "id")
  private User user;

  public Customer() {}

  public Customer(Long customerId, String name, String email, String phone, String policyNumber) {
    this.customerId = customerId;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.policyNumber = policyNumber;
  }

  public Long getCustomerId() {
    return customerId;
  }

  public void setCustomerId(Long customerId) {
    this.customerId = customerId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getPolicyNumber() {
    return policyNumber;
  }

  public void setPolicyNumber(String policyNumber) {
    this.policyNumber = policyNumber;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }
}
