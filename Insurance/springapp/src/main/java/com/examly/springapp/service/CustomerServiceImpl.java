package com.examly.springapp.service;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Customer;
import com.examly.springapp.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {
  private final CustomerRepository repo;

  public CustomerServiceImpl(CustomerRepository repo) {
    this.repo = repo;
  }

  @Override
  public Customer createCustomer(Customer customer) {
    return repo.save(customer);
  }

  @Override
  public List<Customer> getAllCustomers() {
    return repo.findAll();
  }

  @Override
  public Customer getCustomerById(Long id) {
    return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
  }

  @Override
  public Customer updateCustomer(Long id, Customer customerDetails) {
    Customer existingCustomer = repo.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

    existingCustomer.setName(customerDetails.getName());
    existingCustomer.setEmail(customerDetails.getEmail());
    existingCustomer.setPhone(customerDetails.getPhone());
    // Add other fields as needed

    return repo.save(existingCustomer);
  }

  public void deleteCustomer(Long id) {
    if (!repo.existsById(id)) {
    throw new ResourceNotFoundException("Customer not found with id " + id);
  }
  repo.deleteById(id);
  }

 @Override
public Customer getCustomerByUserId(Long userId) {
    return repo.findByUser_Id(userId)
               .orElseThrow(() -> new ResourceNotFoundException("Customer not found for userId " + userId));
}

}

