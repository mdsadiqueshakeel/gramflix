package com.example.referralwallet;

import com.example.referralwallet.service.AdminService;
import com.example.referralwallet.repository.UserRepository;
import com.example.referralwallet.repository.WithdrawRequestRepository;
import com.example.referralwallet.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class AdminServiceTest {

    @InjectMocks
    private AdminService adminService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private WithdrawRequestRepository withdrawRepo;

    @Mock
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void dummy() {
        // simple test, runs without Spring context
    }

    // Add real unit tests here, e.g., approvePremium(), approveWithdraw(), etc.
}
