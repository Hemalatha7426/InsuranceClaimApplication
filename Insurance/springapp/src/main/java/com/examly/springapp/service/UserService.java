package com.examly.springapp.service;

import com.examly.springapp.model.Customer;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.CustomerRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private CustomerRepository customerRepository;

  public User createUser(User user) {
    return userRepository.save(user);
  }

  public Optional<User> getUserById(Long id) {
    return userRepository.findById(id);
  }

  public Optional<User> getUserByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  public void deleteUser(Long id) {
    userRepository.deleteById(id);
  }

  public Long getCustomerIdByUserId(Long userId) {
    // Safely fetch Customer; returns null if not found
    return customerRepository.findByUser_Id(userId)
                             .map(Customer::getCustomerId)
                             .orElse(null);
}
public User updateUser(User user) {
    return userRepository.save(user);
}


}
