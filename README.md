# 🎬 GramFlix - Premium Content & Referral Platform

**GramFlix** is a modern SaaS platform that combines social content sharing, premium subscriptions, and a referral-based earning system. Built with a robust tech stack of **Next.js**, **Spring Boot**, and **MongoDB**, GramFlix provides creators and users with an intuitive platform to share content, earn rewards, and monetize their influence.

🌐 **Live Platform**: [https://gramflix.in](https://gramflix.in)

---

## 📋 Table of Contents

- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Project Architecture](#project-architecture)
- [API Endpoints](#api-endpoints)
- [Environment Setup](#environment-setup)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Support & Contact](#support--contact)

---

## ✨ Core Features

### 👤 User Management
- **Authentication**: Secure JWT-based authentication with email verification
- **User Profiles**: Customizable user profiles with avatar support
- **Account Security**: Password reset, OTP verification, and secure login mechanisms
- **User Types**: Support for different user roles (regular users, premium members, admins)

### 💎 Premium Subscription System
- **Premium Membership**: Request and manage premium upgrades
- **Premium Content Access**: Exclusive content available only to premium members
- **Request Management**: Admin approval workflow for premium requests
- **Status Tracking**: Real-time tracking of premium request status (PENDING, APPROVED, REJECTED)

### 💰 Referral & Wallet System
- **Referral Rewards**: Earn commission through the referral network
- **Digital Wallet**: Track earned balance and transaction history
- **Withdrawal System**: Request withdrawals with minimum balance requirements (₹100+)
- **Admin Approval**: Secure withdrawal approval workflow
- **Transaction History**: Complete audit trail of all transactions

### 📰 News Feed Integration
- **Live News Feed**: Integrated news articles from multiple sources (Mediastack API)
- **Content Curation**: Automatically fetched and updated news content
- **Rich Media Support**: Images, headlines, and descriptions
- **Category Based News**: Organized content by topic

### 🔐 Admin Dashboard
- **User Management**: View and manage all users
- **Premium Request Approval**: Approve or reject premium upgrade requests
- **Withdrawal Management**: Review and process withdrawal requests
- **Admin Actions**: Comprehensive admin control panel

### 🌙 User Experience
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Fully responsive UI optimized for all devices
- **Modern UI Components**: Built with Radix UI and Tailwind CSS
- **Intuitive Navigation**: Clean and user-friendly interface

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.5.0 (React 19.1.0)
- **Styling**: Tailwind CSS 4.0.0
- **UI Components**: Radix UI, Lucide React Icons
- **State Management**: React built-in hooks
- **Build Tool**: Next.js build system with ESLint

### Backend
- **Framework**: Spring Boot 3.3.0
- **Language**: Java 17+
- **Database**: MongoDB
- **Authentication**: JWT (JJWT 0.11.5)
- **Security**: Spring Security with CORS support
- **Email**: Spring Mail for notifications
- **SMS**: Twilio integration for OTP
- **API**: RESTful APIs with comprehensive error handling
- **Caching**: Spring Cache abstraction
- **Build Tool**: Maven with Spring Boot Maven Plugin

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Multi-environment support (local, production)
- **Database**: MongoDB Atlas (Cloud) or Local MongoDB
- **API Integration**: Mediastack for news content

---

## 📁 Project Structure

```
GramFlix/
├── my-app/                           # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                      # Next.js App Router
│   │   │   ├── api/                  # API routes
│   │   │   ├── login/                # Authentication pages
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   ├── profile/              # User profile
│   │   │   ├── premium-request/      # Premium subscription
│   │   │   ├── refer-earn/           # Referral system
│   │   │   ├── withdraw/             # Withdrawal requests
│   │   │   ├── admin-action/         # Admin dashboard
│   │   │   └── coming-soon/
│   │   ├── components/               # Reusable React components
│   │   │   ├── AuthGuard.js          # Authentication wrapper
│   │   │   ├── Navbar.js             # Navigation
│   │   │   ├── HomePage.js           # Landing page
│   │   │   ├── NewsFeed.js           # News feed component
│   │   │   ├── PremiumUpgradePopup.js
│   │   │   ├── WithdrawPage.js
│   │   │   ├── DarkModeToggle.js     # Theme switcher
│   │   │   └── ui/                   # UI component library
│   │   ├── config/                   # Configuration files
│   │   │   └── backend.js            # Backend API config
│   │   ├── lib/                      # Utility functions
│   │   │   └── api.js                # API client
│   │   └── public/                   # Static assets
│   ├── package.json
│   └── Dockerfile
│
├── referral-wallet-system/           # Spring Boot Backend Application
│   ├── src/main/java/com/example/referralwallet/
│   │   ├── ReferralWalletApplication.java  # Main application entry
│   │   ├── config/                   # Configuration classes
│   │   │   ├── SecurityConfig.java   # JWT & Security setup
│   │   │   ├── CorsConfig.java       # CORS configuration
│   │   │   ├── MongoConfig.java      # MongoDB setup
│   │   │   ├── JwtFilterConfig.java  # JWT filter
│   │   │   ├── EmailConfig.java      # Email configuration
│   │   │   ├── WebClientConfig.java  # HTTP client setup
│   │   │   ├── CacheConfig.java      # Caching configuration
│   │   │   └── DataSeeder.java       # Database seeding
│   │   ├── controller/               # REST API Controllers
│   │   │   ├── AuthController.java   # Authentication endpoints
│   │   │   ├── UserController.java   # User management & wallet
│   │   │   ├── AdminController.java  # Admin operations
│   │   │   ├── NewsController.java   # News feed endpoints
│   │   │   ├── OtpController.java    # OTP verification
│   │   │   └── PasswordResetController.java
│   │   ├── service/                  # Business logic
│   │   │   ├── UserService.java
│   │   │   ├── AuthService.java
│   │   │   ├── NewsService.java
│   │   │   └── EmailService.java
│   │   ├── model/                    # Data models
│   │   ├── repository/               # MongoDB repositories
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── util/                     # Utility classes
│   │   │   └── SecurityUtils.java    # JWT utilities
│   │   └── security/                 # Security components
│   ├── src/test/java/                # Unit tests
│   ├── pom.xml                       # Maven configuration
│   └── Dockerfile
│
├── scripts/                          # Deployment scripts
│   ├── build.sh                      # Build script
│   ├── deploy.sh                     # Deployment script
│   └── full-deploy.sh                # Full deployment
│
├── docker-compose.local.yml          # Local development setup
├── docker-compose.prod.yml           # Production setup
├── QUICK_START.md                    # Quick start guide
└── README.md                         # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Java 17+ installed
- Maven 3.8+ installed
- MongoDB 5.0+ (local or Atlas)
- Docker & Docker Compose (optional, for containerized setup)

### Option 1: Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/gramflix.git
cd gramflix
```

#### 2. Start Backend (Spring Boot)
```bash
cd referral-wallet-system

# Install dependencies and build
mvn clean install

# Start the application
mvn spring-boot:run
```

Backend will run on: `http://localhost:8080`

#### 3. Start Frontend (Next.js)
```bash
cd ../my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

#### 4. Access the Application
- **Web App**: [http://localhost:3000](http://localhost:3000)
- **API Docs**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### Option 2: Docker Compose Setup

#### Development Environment
```bash
docker-compose -f docker-compose.local.yml up -d
```

#### Production Environment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🏗 Project Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Next.js Frontend (React 19.1.0)                │   │
│  │  - User Interface                               │   │
│  │  - Authentication flows                         │   │
│  │  - Premium & Wallet Management                  │   │
│  │  - News Feed Display                            │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                    REST API (JSON)
                          │
┌─────────────────────────────────────────────────────────┐
│               API Gateway / Load Balancer                │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                 Backend Service Layer                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Spring Boot Application (Java 17)              │   │
│  │  ┌────────────────────────────────────────────┐ │   │
│  │  │ Controllers (REST Endpoints)               │ │   │
│  │  │ - Auth, User, Admin, News, OTP            │ │   │
│  │  └────────────────────────────────────────────┘ │   │
│  │  ┌────────────────────────────────────────────┐ │   │
│  │  │ Services (Business Logic)                 │ │   │
│  │  │ - User, Auth, News, Email                │ │   │
│  │  └────────────────────────────────────────────┘ │   │
│  │  ┌────────────────────────────────────────────┐ │   │
│  │  │ Security & Middleware                     │ │   │
│  │  │ - JWT Authentication                      │ │   │
│  │  │ - CORS, Security Filters                  │ │   │
│  │  └────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐  ┌──────▼──────┐  ┌──────▼──────┐
│  MongoDB       │  │  Mediastack │  │   Twilio    │
│  (Data Store)  │  │  (News API) │  │  (SMS/OTP)  │
└────────────────┘  └─────────────┘  └─────────────┘
```

### Data Flow
1. **User Authentication**: Credentials → Backend → JWT Token → Frontend
2. **Premium Request**: User Request → Service → Admin Approval → Status Update
3. **Withdrawal Process**: User Request → Validation → Admin Approval → Processing
4. **News Feed**: Mediastack API → News Service → MongoDB → Frontend Display

---

## 📡 API Endpoints

### Authentication Routes
```
POST    /api/auth/login              - User login
POST    /api/auth/signup             - User registration
POST    /api/auth/refresh            - Refresh JWT token
POST    /api/password-reset/request  - Request password reset
POST    /api/password-reset/verify   - Verify reset token
```

### User Routes
```
GET     /api/                        - Get all users (admin)
GET     /api/{id}                    - Get user by ID
PUT     /api/{id}                    - Update user details
DELETE  /api/users/{id}              - Delete user account
GET     /api/withdraw-requests       - Get user's withdrawal requests
POST    /api/withdraw/{amount}       - Request withdrawal
PATCH   /api/premium-request         - Request premium upgrade
```

### Admin Routes
```
POST    /api/admin/premium/approve/{userId}  - Approve premium request
POST    /api/admin/premium/reject/{userId}   - Reject premium request
POST    /api/admin/withdraw/approve/{requestId}  - Approve withdrawal
POST    /api/admin/withdraw/reject/{requestId}   - Reject withdrawal
```

### News Routes
```
GET     /api/news                    - Get news feed
GET     /api/news/{id}               - Get news details
```

### OTP Routes
```
POST    /api/otp/send                - Send OTP
POST    /api/otp/verify              - Verify OTP
```

---

## ⚙️ Environment Setup

### Backend Configuration (referral-wallet-system)

Create `application.properties`:

```properties
# Server
server.port=8080
server.servlet.context-path=/

# MongoDB
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/gramflix
spring.data.mongodb.database=gramflix

# JWT Secret (Generate a secure key)
jwt.secret=your-super-secret-key-min-32-characters-long
jwt.expiration=86400000

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Twilio Configuration
twilio.account.sid=your-account-sid
twilio.auth.token=your-auth-token
twilio.phone.number=+1234567890

# Mediastack API (News Feed)
mediastack.api.key=your-mediastack-api-key

# CORS Configuration
cors.allowed-origins=http://localhost:3000,https://gramflix.in
```

### Frontend Configuration (my-app)

Create `.env.local`:

```env
NEXT_PUBLIC_BACKEND_API=http://localhost:8080
NEXT_PUBLIC_APP_NAME=GramFlix
NEXT_PUBLIC_APP_URL=https://gramflix.in
```

---

## 🐳 Docker Deployment

### Build and Run with Docker Compose

#### Production Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

#### Local Development
```bash
docker-compose -f docker-compose.local.yml up -d
```

### Verify Deployment
```bash
# Check backend health
curl http://localhost:8080/actuator/health

# Check frontend
curl http://localhost:3000
```

---

## 📊 Key Features in Detail

### 1. Referral Wallet System
- Users earn rewards through referrals
- Each referral generates a commission
- Minimum withdrawal threshold: ₹100
- Real-time balance updates
- Transaction history and audit trail

### 2. Premium Subscription
- Users can request premium membership
- Admin approval workflow
- Exclusive content access for premium members
- Request status tracking

### 3. Secure Withdrawal System
- Multi-step approval process
- Withdrawal request validation
- Admin dashboard for processing
- Payment processing integration ready
- Complete audit trail

### 4. News Feed Integration
- Automated news fetching from Mediastack API
- Scheduled updates (configurable interval)
- Rich media support with fallback images
- Category-based organization

### 5. Authentication & Security
- JWT-based token authentication
- Email verification
- OTP support via Twilio
- Password reset with secure tokens
- Role-based access control (RBAC)

---

## 🧪 Testing

### Backend Tests
```bash
cd referral-wallet-system
mvn test
```

### Frontend Tests
```bash
cd my-app
npm run test
```

---

## 📝 Build & Deployment Scripts

### Available Scripts
```bash
# Build both frontend and backend
./scripts/build.sh

# Deploy to production
./scripts/deploy.sh

# Full build, test, and deploy
./scripts/full-deploy.sh
```

---

## 🔗 Live Links

- **🌐 Main Platform**: [https://gramflix.in](https://gramflix.in)
- **📱 Mobile App**: Available on iOS and Android
- **📖 Documentation**: [https://docs.gramflix.in](https://docs.gramflix.in)
- **👥 Support Portal**: [https://support.gramflix.in](https://support.gramflix.in)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 🐛 Known Issues & Roadmap

### Current Version: 1.0.0

#### In Progress
- [ ] Mobile app optimization
- [ ] Advanced analytics dashboard
- [ ] Video content support
- [ ] Social features (comments, likes)
- [ ] Multi-language support

#### Future Enhancements
- [ ] Live streaming support
- [ ] AI-based content recommendations
- [ ] Payment gateway integrations
- [ ] Advanced user analytics
- [ ] Blockchain-based rewards system

---

## 📧 Support & Contact

### Getting Help
- **Email**: support@gramflix.in
- **Discord Community**: [Join our Discord](https://discord.gg/gramflix)
- **Twitter**: [@GramFlixOfficial](https://twitter.com/gramflixofficial)
- **Instagram**: [@GramFlixOfficial](https://instagram.com/gramflixofficial)

### Report Issues
- **Bug Reports**: [GitHub Issues](https://github.com/gramflix/gramflix/issues)
- **Feature Requests**: [Feature Board](https://gramflix.canny.io)

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💼 Team

**GramFlix** is developed and maintained by the Nexro Media Team.

---

## 🙏 Acknowledgments

- Thanks to all contributors and users
- Mediastack for news API
- Twilio for SMS/OTP services
- MongoDB for excellent database
- Spring Boot and Next.js communities

---

**Made with ❤️ by the GramFlix Team**

---

### Last Updated: May 2026
**Version**: 1.0.0  
**Status**: Production Ready ✅
