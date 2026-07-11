# 🌌 Cakrawala Task Management System - Backend API

This repository contains the backend REST API and WebSocket server for the **Cakrawala Task Management System**. It is built using Node.js, Express, Prisma ORM, MySQL, and Socket.IO.

---

## 🏗️ Backend Architecture Overview

The backend handles:
1. **REST API**: Serves endpoints for authentication (JWT), task CRUD, and media attachment management.
2. **WebSockets (Socket.IO)**: Manages real-time notifications, board updates, and active user socket counts.
3. **Database Layer (Prisma & MySQL)**: Defines schema models, relationships, and runs migrations.
4. **Security**: Implements Joi validation, Helmet security headers, CORS origins control, and Express Rate Limit (with trust proxy enabled).

---

## 🚦 Local Development Setup

### 1. Database Setup
Ensure you have MySQL running locally. Create a database named `wadcapstone`:
```sql
CREATE DATABASE wadcapstone;
```

### 2. Configure Environment Variables
Create a `.env` file in the backend root directory:
```bash
cp .env.example .env
```
Set your environment variables:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="mysql://root:yourpassword@localhost:3306/wadcapstone?allowPublicKeyRetrieval=true"
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_REFRESH_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Apply Schema & Migrations
```bash
npx prisma migrate deploy
```

### 5. Seed Database
Run the seeder to populate default categories, users, and tasks:
```bash
node prisma/seed.js
```

### 6. Start the Server
```bash
npm start
```
The server will run at **`http://localhost:3000`** (Swagger docs available at **`http://localhost:3000/api/docs`**).

---

## 🔗 API Endpoints

### Authentication
*   `POST /auth/login`: Authenticate credentials, return user object, and set access token & refresh token.
*   `POST /auth/refresh`: Rotate access token using the stored refresh token.
*   `POST /auth/logout`: Revoke active refresh token.

### Tasks
*   `GET /api/v1/tasks`: Get all tasks (RBAC: regular users only see their own tasks, Admin sees all).
*   `GET /api/v1/tasks/:id`: Get details of a single task (including attachments).
*   `POST /api/v1/tasks`: Create a new task.
*   `PUT /api/v1/tasks/:id`: Update task columns (description Joi validation allows nulls; relation objects are sanitized in repository).
*   `DELETE /api/v1/tasks/:id`: Delete a task (cascades delete of attachments).

### Attachments (Media)
*   `POST /api/v1/media`: Create attachment metadata for a task.
*   `DELETE /api/v1/media/:id`: Delete attachment metadata.

### Users
*   `GET /api/v1/users`: Retrieve all registered users.

---

## ⚡ Socket.IO Events

The Socket.IO server runs alongside Express to broadcast live changes:
*   `join_task_details (taskId)`: Joins a room specifically for real-time task detail changes.
*   `leave_task_details (taskId)`: Leaves the room.
*   `online_count (count)`: Broadcasts globally the number of active socket connections.
*   `task_updated (task)`: Emitted when a task is updated (to refresh task boards).
*   `task_deleted (taskId)`: Emitted when a task is deleted.
*   `attachment_added (attachment)`: Emitted to a specific task details room when a new file is attached.
*   `attachment_deleted (attachment)`: Emitted to a specific task details room when an attachment is removed.

---

## 📊 Database ERD

```mermaid
erDiagram
    User ||--o{ Task : creates
    User ||--o{ RefreshToken : owns
    Category ||--o{ Task : classifies
    Task ||--o{ Attachment : has
    
    User {
        int id PK
        string name
        string email
        string password
        string role
        datetime createdAt
        datetime updatedAt
    }
    
    Category {
        int id PK
        string name
        string color
        datetime createdAt
        datetime updatedAt
    }

    Task {
        int id PK
        string title
        string description
        string status
        string priority
        int userId FK
        int categoryId FK
        datetime createdAt
        datetime updatedAt
    }

    Attachment {
        int id PK
        string fileName
        string fileUrl
        int fileSize
        string mimeType
        int taskId FK
        datetime createdAt
        datetime updatedAt
    }

    RefreshToken {
        int id PK
        string token
        int userId FK
        datetime expiresAt
        datetime createdAt
    }
```
