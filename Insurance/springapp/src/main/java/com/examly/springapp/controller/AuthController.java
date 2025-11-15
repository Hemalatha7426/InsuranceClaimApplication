package com.examly.springapp.controller;

import com.examly.springapp.dto.LoginDto;
import com.examly.springapp.dto.RegisterDto;
import com.examly.springapp.model.Customer;
import com.examly.springapp.model.User;
import com.examly.springapp.model.User.Role;
import com.examly.springapp.repository.CustomerRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow all origins
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder encoder;

    // ----------- REGISTER -----------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto request) {
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Password is required");
        }

        User user = new User();
        user.setName(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(encoder.encode(request.getPassword()));

        // Safe role handling
        Role finalRole = User.Role.CUSTOMER; // default
        if (request.getRole() != null) {
            try {
                finalRole = Role.valueOf(request.getRole().toString().toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid role: " + request.getRole());
            }
        }
        user.setRole(finalRole);

        // Save User
        User savedUser = userRepository.save(user);

        // If role is CUSTOMER, create linked Customer record
        if (savedUser.getRole() == Role.CUSTOMER) {
            Customer customer = new Customer();
            customer.setUser(savedUser);
            customer.setName(savedUser.getName());
            customer.setEmail(savedUser.getEmail());
            customer.setPhone(request.getPhone() != null ? request.getPhone() : "NA");
            customer.setPolicyNumber("NA"); // default (or auto-generate)
            customerRepository.save(customer);
        }

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    // ----------- LOGIN -----------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dto) {
        try {
            // Authenticate user
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
            );

            // Fetch user
            User user = userService.getUserByEmail(dto.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Base response
            Map<String, Object> response = Map.of(
                    "message", "Login successful",
                    "userId", user.getId(),
                    "email", user.getEmail(),
                    "role", user.getRole().name()
            );

            // Add customer details if role is CUSTOMER
            if (user.getRole() == Role.CUSTOMER) {
                Customer customer = customerRepository.findByUser_Id(user.getId())
                        .orElse(null);

                if (customer != null) {
                    response = Map.of(
                            "message", "Login successful",
                            "userId", user.getId(),
                            "email", user.getEmail(),
                            "role", user.getRole().name(),
                            "customerId", customer.getCustomerId(),
                            "phone", customer.getPhone()
                    );
                }
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Invalid email or password"));
        }
    }
}
