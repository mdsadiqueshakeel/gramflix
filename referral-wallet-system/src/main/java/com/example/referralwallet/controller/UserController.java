package com.example.referralwallet.controller;

import com.example.referralwallet.model.User;
import com.example.referralwallet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

     // Get all users
     @GetMapping
     public ResponseEntity<List<User>> getAllUsers() {
         List<User> users = userRepository.findAll();
         return ResponseEntity.ok(users);
     }

     // Get user by ID
     @GetMapping("/{id}")
     public ResponseEntity<User> getUserById(@PathVariable String id) {
         Optional<User> user = userRepository.findById(id);
         return user.map(ResponseEntity::ok)
                 .orElse(ResponseEntity.notFound().build());
     }

     // Update premium request
     @PatchMapping("/premium-request")
     public ResponseEntity<User> requestPremium(@RequestParam String mobile) {
     Optional<User> optionalUser = userRepository.findByMobile(mobile);

     if (optionalUser.isEmpty()) {
         return ResponseEntity.notFound().build();
     }

     User user = optionalUser.get();
     user.setPremiumRequestStatus("PENDING");
     userRepository.save(user);

     return ResponseEntity.ok(user);
 }


     // Update user details
     @PutMapping("/{id}")
     public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
         Optional<User> optionalUser = userRepository.findById(id);

         if (optionalUser.isEmpty()) {
             return ResponseEntity.notFound().build();
         }

         User user = optionalUser.get();
         user.setName(updatedUser.getName());
         user.setEmail(updatedUser.getEmail());
         user.setMobile(updatedUser.getMobile());
         user.setUserType(updatedUser.getUserType());
         user.setStatus(updatedUser.getStatus());
         // Only update premium status if provided
         user.setPremiumRequestStatus(updatedUser.getPremiumRequestStatus());

         userRepository.save(user);
         return ResponseEntity.ok(user);
     }

     // Delete user
     @DeleteMapping("/{id}")
     public ResponseEntity<Void> deleteUser(@PathVariable String id) {
         if (!userRepository.existsById(id)) {
             return ResponseEntity.notFound().build();
         }

         userRepository.deleteById(id);
         return ResponseEntity.noContent().build();
     }
}
