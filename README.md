# 🚀 WAD Capstone API - Task Management System

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.16.0-brightgreen)](https://nodejs.org/)
[![Prisma Version](https://img.shields.io/badge/prisma-7.8.0-blue)](https://www.prisma.io/)
[![Express Version](https://img.shields.io/badge/express-5.2.1-lightgrey)](https://expressjs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

WAD Capstone API is a modern, high-performance backend task management service built using **Node.js (Express)** and **Prisma ORM (v7)**. The project features production-ready security patterns, Role-Based Access Control (RBAC), multi-tenant/multi-user data isolation, auto-rotation refresh tokens with reuse detection, rate limiting, and attachment management.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js v22.x
- **Framework**: Express.js v5 (with preflight CORS optimizations)
- **Database Engine**: MySQL / MariaDB
- **ORM**: Prisma ORM v7.8.0 (utilizing the native MariaDB driver adapter `@prisma/adapter-mariadb`)
- **Password Hashing**: Argon2id (conforming to OWASP recommendations: memoryCost 64MB, timeCost 3, parallelism 4)
- **Authorization**: JSON Web Tokens (JWT)
- **Request Validation**: Joi
- **Security Middlewares**: Helmet (Header Security), CORS, Rate Limiters (express-rate-limit)
- **Documentation**: Swagger UI / OpenAPI 3.0

---

## 🏗️ Folder Structure

```text
/
├── prisma/
│   ├── schema.prisma   # Database schema models (User, Task, Category, Attachment, RefreshToken)
│   └── seed.js         # Database seeder (Category, Users with Argon2id, Tasks)
├── src/
│   ├── config/         # System configurations (App configuration, CORS, rate limiter, Prisma Client)
│   ├── controllers/    # Request and response controllers (Auth, Tasks, Health, Info, Echo)
│   ├── docs/           # Swagger / OpenAPI documentation config
│   ├── media/          # Media / Attachments module (Routes, Controller, Repository, Validator)
│   ├── middleware/     # Custom Middlewares (JWT Authenticate, Role Authorize, Request Sanitizers)
│   ├── repositories/   # Abstract data access layers (User & Task Repositories)
│   ├── routes/         # Router mounting directory (Auth, Tasks, Users, Admin routers)
│   ├── services/       # Core business services (Auth logic, Token Rotation & Reuse Detection)
│   ├── validators/     # Request Joi validators
│   └── index.js        # Main Express application initialization
├── cakrawala_api_collection.json  # Exported Postman Collection
├── verify_all_endpoints.sh        # Automated test verification runner
└── docker-compose.yml             # Docker MySQL/MariaDB database container definition
```

---

## 🚦 Chronological Installation & Setup Guide

Follow these steps from scratch to set up and run the project:

### Step 1: Install Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v22.16.0 or higher)
- **Docker** and **Docker Compose** (for running the database container)

### Step 2: Install Project Dependencies
Run npm install in the root folder of the project:
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory. You can copy the values from `.env.example`:
```bash
cp .env.example .env
```
Inside `.env`, verify the credentials and settings:
```env
PORT=3000
NODE_ENV=development
APP_NAME="WAD Capstone API"
APP_VERSION=1.0.0

# Database URL
DATABASE_URL="mysql://root:guyonwaton@localhost:3306/wadcapstone"

# JWT Secrets (used for sign and verify)
JWT_ACCESS_SECRET=T3LK0MS3l!23
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=T3LK0MS3l!23456789
JWT_REFRESH_EXPIRES_IN=7d

# Permitted Origins
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Step 4: Spin Up the MySQL Database Container
Start the MySQL database service and phpMyAdmin utility using Docker Compose:
```bash
docker compose up -d
```
*You can access phpMyAdmin to visually manage the database at `http://localhost:8080`.*

### Step 5: Run Database Migrations & Generate Prisma Client
Apply the schema structure migrations to your MySQL database and generate the local Prisma Client:
```bash
# Apply database schemas
npx prisma migrate dev

# Generate local Prisma Client bindings
npx prisma generate
```

### Step 6: Seed the Database
Populate the database with initial categories, default users (including an admin), and testing tasks:
```bash
npm run db:seed
```
This inserts the following default testing credentials:
- **Normal User Budi**: `budi@example.com` | Password: `P@ssw0rd!` (Role: `USER`)
- **Normal User Siti**: `siti@example.com` | Password: `P@ssw0rd!` (Role: `USER`)
- **Admin User**: `admin@example.com` | Password: `P@ssw0rd!` (Role: `ADMIN`)

### Step 7: Launch the Application
Start the application in development mode:
```bash
# Run with Nodemon hot-reloading
npm start

# OR run using node directly
npm run dev
```
The server will boot up and remain active at **`http://localhost:3000`**.

---

## 💻 How to Test & Hit the Endpoints

### 1. Postman Collection (`cakrawala_api_collection.json`)
The [cakrawala_api_collection.json](file:///root/cakrawala/wadv2/cakrawala_api_collection.json) file contains a ready-to-import Postman Collection covering all endpoints:
1. **Import in Postman**: Click *Import* -> Select `cakrawala_api_collection.json`.
2. **Environment Variables**:
   - `host` defaults to `http://localhost:3000`.
   - `baseUrl` defaults to `http://localhost:3000/api/v1`.
3. **Automated Token Assignment**: The `Login` and `Refresh Token` requests contain pre-configured Postman test scripts that automatically grab `accessToken` / `refreshToken` from the response payload and set them into the collection variables.
4. **Endpoint Categories**:
   - **Auth**: Register, Login, Me (Profile), Refresh Token, Logout.
   - **Tasks**: List Tasks, Create Task, Get Task Detail, Update Task (PUT/Full & PATCH/Partial), Delete Task.
   - **Media**: List Media, Create Media, Get Media Detail, Delete Media.
   - **Users**: Get User Tasks (`/api/v1/users/:userId/tasks`).
   - **Admin**: List Users, Update User Role, List All Tasks.
   - **System**: Health Check, System Info, Echo.

### 2. Interactive Swagger UI
Access the auto-generated Swagger documentation for live endpoint testing:
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

---

## 🚦 Automated Test Suite (`verify_all_endpoints.sh`)

We have created an automated verification suite that runs locally to test structural flows and security validations. Run it using bash:
```bash
bash verify_all_endpoints.sh
```

The script runs the following workflow checks chronologically:

1. **Alur 1 — Testing RBAC**
   - Logs in as a standard user (`USER` role).
   - Attempts to access the admin endpoint `GET /api/v1/admin/users` (returns `403 Forbidden` - **Expected**).
   - Logs in as an admin (`ADMIN` role) and successfully fetches the user list (returns `200 OK` - **Expected**).
   - Promotes a user to `ADMIN` (returns `200 OK` - **Expected**).

2. **Alur 2 — Testing Ownership Check**
   - Retrieves all tasks owned by User Budi (verifies they belong exclusively to Budi's ID).
   - Edits Budi's own task successfully (returns `200 OK` - **Expected**).
   - Attempts to edit User Siti's task as User Budi (returns `403 Forbidden` - **Expected**).
   - Performs editing on User Siti's task as Admin (returns `200 OK` - **Expected**).

3. **Alur 3 — Testing Rate Limiting**
   - Sends 6 consecutive invalid login requests to `/api/v1/auth/login`.
   - The 6th request fails with `429 Too Many Requests` (**Expected**).
   - Checks headers for `RateLimit-*` and `X-RateLimit-*` limiters (**Expected**).

4. **Alur 4 — Testing Security Headers (Helmet)**
   - Queries `/health` using curl.
   - Verifies the inclusion of security headers: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Strict-Transport-Security`, and `Referrer-Policy: no-referrer` (**Expected**).
