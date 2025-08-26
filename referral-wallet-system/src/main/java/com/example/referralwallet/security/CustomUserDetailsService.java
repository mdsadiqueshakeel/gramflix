package com.example.referralwallet.security;

import com.example.referralwallet.model.User;
import com.example.referralwallet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService {

    private final UserRepository userRepository;

    // Load by database ID (used when JWT contains userId)
    public UserDetails loadUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));

        return buildSpringUser(user);
    }

    // Load by email or mobile (used for login)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmailOrMobile(username, username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email or mobile: " + username));

        return buildSpringUser(user);
    }

    // Helper to create a Spring Security UserDetails object
    private UserDetails buildSpringUser(User user) {
        return new org.springframework.security.core.userdetails.User(
                user.getId(),          // ID as username
                user.getPassword(),    // updated field
                List.of(new SimpleGrantedAuthority(
                        "ACTIVE".equals(user.getStatus()) ? "ROLE_USER" : "ROLE_INACTIVE"
                ))
        );
    }
}
