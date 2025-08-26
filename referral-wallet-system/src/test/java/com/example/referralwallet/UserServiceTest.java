package com.example.referralwallet;

import com.example.referralwallet.service.UserService;
import com.example.referralwallet.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void dummy() {
        // This test will pass without loading Spring context
    }

    // Add unit tests for withdraw/premium request logic here
}
