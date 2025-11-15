package com.examly.springapp.service;

import com.examly.springapp.model.Customer;
import java.util.List;

public interface CustomerService {
  Customer createCustomer(Customer customer);
  List<Customer> getAllCustomers();
   Customer updateCustomer(Long id, Customer customer);
  Customer getCustomerById(Long id);
  void deleteCustomer(Long id);
  Customer getCustomerByUserId(Long userId); 
}

