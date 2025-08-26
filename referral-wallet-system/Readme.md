# Referral Wallet System

## Overview
A Spring Boot application that implements a referral-based wallet system with user registration, OTP verification, premium user upgrades, wallet management, and withdrawal functionality.

## Features

### Authentication
- Two-step registration with OTP verification (email/WhatsApp)
- JWT-based authentication
- Password security with BCrypt encryption

### User Management
- Normal and Premium user types
- Admin user for system management
- User profile management

### Referral System
- Unique referral codes for each user
- Referral bonus credits (200 units) when referred users register
- Wallet balance tracking

### Wallet Features
- Wallet balance tracking
- Transaction history
- Withdrawal requests (for Premium users)
- Admin approval/rejection of withdrawals

### Premium Upgrade
- Users can request premium status
- Admin approval/rejection of premium requests
- Premium users get additional benefits (withdrawal capability)

### Notifications
- Email notifications for OTP verification
- WhatsApp notifications (via Twilio)
- Admin notifications for premium and withdrawal requests

## Technical Stack

### Backend
- Java 17
- Spring Boot
- Spring Security with JWT
- MongoDB Atlas for database
- Spring Mail for email notifications
- Twilio API for WhatsApp messages

### Security
- JWT authentication
- Password encryption with BCrypt
- OTP verification for registration

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user (step 1)
- `POST /api/auth/verify-otp` - Verify OTP and complete registration (step 2)
- `POST /api/auth/login` - User login

### OTP
- `POST /api/otp/send` - Send OTP
- `POST /api/otp/verify` - Verify OTP

### User
- `POST /api/user/withdraw` - Request withdrawal
- `POST /api/user/premium/request` - Request premium upgrade
- `GET /api/user/all-users` - List all users (admin/debug)

### Admin
- `POST /api/admin/premium/approve` - Approve premium request
- `POST /api/admin/premium/reject` - Reject premium request
- `POST /api/admin/withdraw/approve` - Approve withdrawal request
- `POST /api/admin/withdraw/reject` - Reject withdrawal request

## Setup and Configuration

### Prerequisites
- Java 17+
- Maven
- MongoDB Atlas account
- Gmail account (for email notifications)
- Twilio account (for WhatsApp notifications)

### Configuration
The application uses the following configuration properties in `application.properties`:

```properties
# MongoDB Atlas connection
spring.data.mongodb.uri=your_mongodb_uri
spring.data.mongodb.database=referralwallet

# JWT
app.jwt.secret=your_jwt_secret
app.jwt.expirationMs=3600000

# Email (Gmail)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Twilio WhatsApp
twilio.accountSid=your_twilio_account_sid
twilio.authToken=your_twilio_auth_token
twilio.whatsapp.from=whatsapp:+your_twilio_number

# OTP behavior
otp.dev-echo=true  # Set to false in production
```

### Running the Application
```bash
mvn spring-boot:run
```

## Security Notes
- Replace default JWT secret in production
- Use environment variables for sensitive credentials
- Disable OTP echo in production by setting `otp.dev-echo=false`
- Use app-specific passwords for Gmail
- Secure MongoDB Atlas with IP whitelisting

## Development Notes
- The system uses a two-step registration process with OTP verification
- Referral bonuses are automatically credited when referred users register
- Premium users can request withdrawals
- All withdrawal and premium requests require admin approval

## Project Structure

### Directory Structure
```
src
├── main
│   ├── java
│   │   └── com
│   │       └── example
│   │           └── referralwallet
│   │               ├── config
│   │               ├── controller
│   │               ├── dto
│   │               ├── model
│   │               ├── repository
│   │               ├── security
│   │               ├── service
│   │               └── util
│   └── resources
│       └── templates
└── test
    └── java
        └── com
            └── example
                └── referralwallet
                    ├── config
                    ├── controller
                    ├── dto
                    ├── model
                    ├── repository
                    ├── security
                    ├── service
                    └── util
```

### Key Files

#### Main Application
- `ReferralWalletApplication.java` - Main Spring Boot application class

#### Configuration
- `DataSeeder.java` - Initializes database with seed data
- `EmailConfig.java` - Email service configuration
- `JwtFilterConfig.java` - JWT filter configuration
- `MongoConfig.java` - MongoDB configuration
- `SecurityConfig.java` - Spring Security configuration

#### Controllers
- `AdminController.java` - Admin endpoints for approving/rejecting requests
- `AuthController.java` - Authentication endpoints
- `OtpController.java` - OTP generation and verification
- `UserController.java` - User-related endpoints

#### Models
- `User.java` - User entity with wallet balance and referral info
- `WalletTransaction.java` - Wallet transaction records
- `WithdrawRequest.java` - Withdrawal request entity
- `PremiumRequest.java` - Premium upgrade request entity
- `Otp.java` - OTP entity for verification
- `AuditLog.java` - System audit logs

#### Services
- `AuthService.java` - Authentication and user registration
- `UserService.java` - User management and wallet operations
- `AdminService.java` - Admin operations
- `ReferralService.java` - Referral bonus processing
- `EmailService.java` - Email notifications
- `TwilioService.java` - WhatsApp notifications
- `OtpService.java` - OTP generation and verification

#### Security
- `JwtProvider.java` - JWT token generation and validation
- `JwtAuthenticationFilter.java` - JWT authentication filter
- `CustomUserDetailsService.java` - User details service for authentication

#### Repositories
- `UserRepository.java` - User data access
- `WithdrawRequestRepository.java` - Withdrawal request data access
- `PremiumRequestRepository.java` - Premium request data access
- `OtpRepository.java` - OTP data access
- `AuditLogRepository.java` - Audit log data access

#### Utilities
- `DateUtil.java` - Date formatting and manipulation
- `PasswordEncoderUtil.java` - Password encoding utilities
- `ResponseUtil.java` - Standardized API responses
- `TokenGenerator.java` - OTP and token generation

#### DTOs (Data Transfer Objects)
- `AuthDtos.java` - Authentication request/response objects
- `OtpDtos.java` - OTP request/response objects
- `UserDtos.java` - User-related request/response objects
- `AdminDtos.java` - Admin-related request/response objects