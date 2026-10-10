# ServiceHub — Smart Local Service Management Platform

ServiceHub is a complete, full-stack, enterprise-grade local service marketplace built with Java 21 Spring Boot, MySQL, and React (Vite).

---

## 🚀 Tech Stack

- **Frontend**: React 18 / 19, Vite, React Router v6, Axios, Lucide Icons, Vanilla CSS (Glassmorphism & Vibrant Design System).
- **Backend**: Java 21, Spring Boot 3.3.4, Maven, Spring Security 6, JWT Authentication, Spring Data JPA.
- **Database**: MySQL 8.x (Local instance).
- **Architecture**: Layered MVC (Controller -> Service -> Repository -> Entity/DTO).

---

## 📁 Directory Structure

```text
ServiceHub/
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/servicehub/
│           │   ├── config/             # Security & DataSeeder
│           │   ├── controller/         # REST Endpoints
│           │   ├── dto/                # Data Transfer Objects
│           │   ├── entity/             # JPA Data Models
│           │   ├── exception/          # Centralized Exception Handling
│           │   ├── repository/         # Spring Data Repositories
│           │   ├── security/           # JWT & UserDetails
│           │   └── service/            # Core Business Logic
│           └── resources/
│               └── application.properties
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── api/                # Centralized Axios Client
│       ├── components/         # Reusable Navigation, Modals, Badges
│       ├── context/            # Auth State Provider
│       └── pages/              # Customer, Provider & Admin Dashboards
├── .gitignore
└── README.md
```

---

## 🗄️ Database Setup (MySQL)

1. Ensure MySQL server is running locally on default port `3306`.
2. Create database `servicehub` manually or let Spring Boot automatically create it:
   ```sql
   CREATE DATABASE IF NOT EXISTS servicehub;
   ```
3. Set your MySQL root password using environment variable `MYSQL_PASSWORD`:
   - **PowerShell (Windows)**:
     ```powershell
     $env:MYSQL_PASSWORD="your_mysql_password"
     ```
   - **Bash / Linux / macOS**:
     ```bash
     export MYSQL_PASSWORD="your_mysql_password"
     ```

---

## ⚙️ Environment Configuration

Backend configuration properties in `backend/src/main/resources/application.properties`:

| Key | Default / Fallback | Description |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3306/servicehub?...` | Database JDBC URL |
| `MYSQL_USER` | `root` | MySQL Database User |
| `MYSQL_PASSWORD` | `""` | MySQL Database Password |
| `JWT_SECRET` | 256-bit Hex Key | Secret for signing JWT tokens |
| `ADMIN_EMAIL` | `admin@servicehub.com` | Initial Seeded Admin Email |
| `ADMIN_PASSWORD` | `Admin@12345` | Initial Seeded Admin Password |

---

## 🔑 Pre-Seeded Accounts for Testing

Upon starting the backend, `DataSeeder` populates initial demonstration data:

1. **System Administrator**:
   - **Email**: `admin@servicehub.com`
   - **Password**: `Admin@12345`
   - **Role**: `ADMIN`
2. **Sample Verified Provider**:
   - **Email**: `pro.john@servicehub.com`
   - **Password**: `Provider@123`
   - **Role**: `PROVIDER`
3. **Sample Customer**:
   - **Email**: `customer.alice@gmail.com`
   - **Password**: `Customer@123`
   - **Role**: `CUSTOMER`

---

## 🏃 Commands to Run the Application

### 1. Run Backend Server (Port 8082)

```bash
cd backend
mvn spring-boot:run
```

- **Health Check Endpoint**: `http://localhost:8082/api/health`

### 2. Run Frontend Server (Port 5174)

```bash
cd frontend
npm install
npm run dev
```

- Access the Application UI at: `http://localhost:5174`

---

## 🌐 API Reference Overview

- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Categories**: `/api/categories` (GET, POST, PUT, DELETE)
- **Services**: `/api/services` (GET search, POST, PUT, DELETE)
- **Providers**: `/api/providers`, `/api/providers/pending`, `/api/providers/{id}/status`
- **Requests**: `/api/requests` (POST, GET my, GET incoming, PUT cancel)
- **Quotations**: `/api/quotations` (POST, GET by request, POST accept, POST reject)
- **Bookings**: `/api/bookings` (GET my, GET provider, PUT status)
- **Reviews**: `/api/reviews` (POST, GET provider reviews)
- **Complaints**: `/api/complaints` (POST, GET my, GET all [admin], PUT resolve [admin])
- **Admin**: `/api/admin/stats`, `/api/admin/users`, `/api/admin/users/{id}/toggle-status`

---

## 🔧 Troubleshooting

- **Database connection error**: Verify MySQL is active on port 3306 and environment variable `MYSQL_PASSWORD` matches your root password.
- **CORS Error**: Ensure frontend port is running on `http://localhost:5174` which is allowed by `SecurityConfig.java`.
- **JWT Expired**: Log out and log back in to refresh JWT authentication header.
