# Referral Wallet System - Backend

This document outlines the backend structure, API endpoints, and instructions on how to run the application.

## Directory Structure

```
. (f:\scam\fullstack-gramflix\referral-wallet-system\src\main\java\com\example\referralwallet)
├── ReferralWalletApplication.java
├── config\
│   ├── DataSeeder.java
│   ├── EmailConfig.java
│   ├── JwtFilterConfig.java
│   ├── MongoConfig.java
│   └── SecurityConfig.java
├── controller\
│   ├── AdminController.java
│   ├── AuthController.java
│   ├── OtpController.java
│   └── UserController.java
├── dto\
│   ├── AdminDtos.java
│   ├── AuthDtos.java
│   ├── OtpDtos.java
│   └── UserDtos.java
├── model\
│   ├── AuditLog.java
│   ├── Otp.java
│   ├── PremiumRequest.java
│   ├── User.java
│   ├── WalletTransaction.java
│   └── WithdrawRequest.java
├── repository\
│   ├── AuditLogRepository.java
│   ├── OtpRepository.java
│   ├── PremiumRequestRepository.java
│   ├── UserRepository.java
│   └── WithdrawRequestRepository.java
├── security\
│   ├── CustomUserDetailsService.java
│   ├── JwtAuthenticationFilter.java
│   └── JwtProvider.java
├── service\
│   ├── AdminService.java
│   ├── AuthService.java
│   ├── EmailService.java
│   ├── OtpService.java
│   ├── ReferralService.java
│   ├── TwilioService.java
│   └── UserService.java
└── util\
    ├── DateUtil.java
    ├── PasswordEncoderUtil.java
    ├── ResponseUtil.java
    └── TokenGenerator.java
```

## API Endpoints

### AuthController (`/api/auth`)

- `POST /api/auth/init-register`
  - Description: Initiates user registration.
  - Request Body: `AuthDtos.RegisterRequest`
    ```json
    {
      "name": "string",
      "email": "string",
      ""mobile": "string",
      "password": "string",
      "referralId": "string" (optional)
    }
    ```
- `POST /api/auth/complete-register`
  - Description: Completes user registration after OTP verification.
  - Request Body: `OtpDtos.OtpVerifyRequest`
    ```json
    {
      "to": "long",
      "code": "string"
    }
    ```
- `POST /api/auth/login`
  - Description: User login.
  - Request Body: `AuthDtos.LoginRequest`
    ```json
    {
      "emailOrMobile": "string",
      "password": "string"
    }
    ```

### OtpController (`/api/otp`)

- `POST /api/otp/send`
  - Description: Sends OTP to the specified recipient.
  - Request Body: `OtpDtos.OtpSendRequest`
    ```json
    {
      "to": "long",
      "channel": "string" (optional, "whatsapp" | "email")
    }
    ```
- `POST /api/otp/verify`
  - Description: Verifies the provided OTP.
  - Request Body: `OtpDtos.OtpVerifyRequest`
    ```json
    {
      "to": "long",
      "code": "string"
    }
    ```

### UserController (`/api/user`)

- `POST /api/user/withdraw`
  - Description: Initiates a withdrawal request.
  - Request Body: (Requires authentication) `UserDtos.WithdrawRequestDto`
    ```json
    {
      "userId": "string",
      "amount": "double"
    }
    ```
- `POST /api/user/premium/request`
  - Description: Requests premium membership.
  - Request Body: (Requires authentication) `UserDtos.PremiumRequestDto`
    ```json
    {
      "userId": "string"
    }
    ```
- `GET /api/user/all-users`
  - Description: Retrieves a list of all users.
  - Request Body: (Requires authentication) None

### AdminController (`/api/admin`)

- `POST /api/admin/premium/approve`
  - Description: Approves a premium membership request.
  - Request Body: (Requires authentication, Admin role) `AdminDtos.ApproveRejectDto`
    ```json
    {
      "userId": "string",
      "withdrawRequestId": "string" (This field name seems incorrect for premium approval, should be premiumRequestId)
    }
    ```
- `POST /api/admin/premium/reject`
  - Description: Rejects a premium membership request.
  - Request Body: (Requires authentication, Admin role) `AdminDtos.ApproveRejectDto`
    ```json
    {
      "userId": "string",
      "withdrawRequestId": "string" (This field name seems incorrect for premium rejection, should be premiumRequestId)
    }
    ```
- `POST /api/admin/withdraw/approve`
  - Description: Approves a withdrawal request.
  - Request Body: (Requires authentication, Admin role) `AdminDtos.ApproveRejectDto`
    ```json
    {
      "userId": "string",
      "withdrawRequestId": "string"
    }
    ```
- `POST /api/admin/withdraw/reject`
  - Description: Rejects a withdrawal request.
  - Request Body: (Requires authentication, Admin role) `AdminDtos.ApproveRejectDto`
    ```json
    {
      "userId": "string",
      "withdrawRequestId": "string"
    }
    ```

## How to Run the Backend

1.  **Prerequisites:**
    *   Java Development Kit (JDK) 17 or higher
    *   Maven
    *   MongoDB instance (local or cloud-based)

2.  **Configuration:**
    *   Create an `application.properties` file in `src/main/resources` (if it doesn't exist).
    *   Configure your MongoDB connection and JWT secret in `application.properties`:
        ```properties
        spring.data.mongodb.uri=mongodb://localhost:27017/referralwallet
        app.jwt.secret=YourSuperSecretJwtKeyThatIsAtLeast256BitsLong
        app.jwt.expirationMs=86400000 # 24 hours
        ```
    *   If using Twilio for OTP, configure your Twilio credentials:
        ```properties
        twilio.accountSid=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        twilio.authToken=your_auth_token
        twilio.phoneNumber=+1234567890
        ```

3.  **Build the Project:**
    Navigate to the `referral-wallet-system` directory (e.g., `f:\scam\fullstack-gramflix\referral-wallet-system`) in your terminal and run:
    ```bash
    mvn clean install
    ```

4.  **Run the Application:**
    ```bash
    mvn spring-boot:run
    ```

    The application will start on `http://localhost:8080` by default.

## Complete Workflow

1.  **User Registration & OTP Verification:**
    *   User sends a `POST` request to `/api/auth/init-register` with email and password.
    *   Backend sends an OTP to the provided email/mobile.
    *   User sends a `POST` request to `/api/otp/verify` with the OTP and email/mobile.
    *   If OTP is verified, user sends a `POST` request to `/api/auth/complete-register` to finalize registration.

2.  **User Login:**
    *   User sends a `POST` request to `/api/auth/login` with email and password.
    *   Backend returns a JWT token upon successful authentication.

3.  **Authenticated Requests:**
    *   For all protected endpoints (not `/api/auth/**`, `/api/otp/**`, `/h2/**`, `/swagger-ui/**`, `/v3/api-docs/**`), include the JWT token in the `Authorization` header as a Bearer token.

4.  **User Actions (e.g., Withdraw, Premium Request):**
    *   Authenticated users can send `POST` requests to `/api/user/withdraw` or `/api/user/premium/request` with the required data.

5.  **Admin Actions:**
    *   Users with Admin roles can approve/reject premium requests and withdrawal requests via `POST` requests to the respective `/api/admin/**` endpoints.

## Data Required for Each Route

(Detailed in the "API Endpoints" section above, under "Request Body" for each endpoint.)

This `Readme.md` provides a comprehensive overview for anyone looking to understand and run the backend of the Referral Wallet System.