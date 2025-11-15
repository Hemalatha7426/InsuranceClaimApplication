package com.examly.springapp.config;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

  @Autowired
  private UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    return org.springframework.security.core.userdetails.User.builder()
        .username(user.getEmail())
        .password(user.getPasswordHash())
        .roles(user.getRole().name()) // assign ROLE_ADMIN, ROLE_CUSTOMER, etc.
        .build();
  }
}

