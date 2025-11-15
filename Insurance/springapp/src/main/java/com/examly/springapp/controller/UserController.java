package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/users")
public class UserController {

  @Autowired
  private UserService userService;

  @PostMapping
  public ResponseEntity<User> createUser(@RequestBody User user) {
    return ResponseEntity.ok(userService.createUser(user));
  }

  @GetMapping("/{id}")
  public ResponseEntity<User> getUser(@PathVariable Long id) {
    return userService.getUserById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping
  public List<User> getAllUsers() {
    return userService.getAllUsers();
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.deleteUser(id);
    return ResponseEntity.noContent().build();
  }
  @PutMapping("/{id}")
public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
    return userService.getUserById(id)
        .map(existingUser -> {
            existingUser.setName(updatedUser.getName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setRole(updatedUser.getRole());
            // ✅ Add more fields if your User model has them (e.g., password, phone, etc.)
            
            User savedUser = userService.updateUser(existingUser);
            return ResponseEntity.ok(savedUser);
        })
        .orElse(ResponseEntity.notFound().build());
}

}

