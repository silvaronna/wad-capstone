# 🌌 Cakrawala Task Management System (Fullstack System)

Welcome to the **Cakrawala Task Management System**. This repository acts as the root workspace for both the React + Vite frontend and the Node.js Express backend using MySQL and Prisma ORM.

---

## 🏗️ Deployment Architecture & Inbound Traffic Logic

The application is deployed directly on the host server. The Nginx reverse proxy handles SSL/TLS termination, routes traffic to the respective PM2 processes, and redirects unencrypted HTTP traffic to HTTPS.

### Traffic Flow Diagram
```mermaid
sequenceDiagram
    autonumber
    actor Client as Client Browser
    participant Nginx as Nginx Proxy (Host)
    participant PM2_FE as PM2: Vite Frontend (Port 5173)
    participant PM2_BE as PM2: Express Backend (Port 3000)
    participant DB as MySQL Database (Port 3306)

    %% Scenario 1: HTTP Redirect
    Note over Client, Nginx: Scenario A: User accesses HTTP port 8000
    Client->>Nginx: GET http://wad-capstone.silvaronna.my.id:8000/tasks
    Nginx-->>Client: HTTP 301 Redirect to https://wad-capstone.silvaronna.my.id:8443/tasks

    %% Scenario 2: HTTPS Flow
    Note over Client, Nginx: Scenario B: User accesses HTTPS port 8443
    Client->>Nginx: GET https://wad-capstone.silvaronna.my.id:8443/tasks (Terminates SSL)
    
    alt Path matches /
        Nginx->>PM2_FE: Proxy Pass to http://localhost:5173/tasks
        PM2_FE-->>Nginx: Returns HTML/JS Assets
        Nginx-->>Client: Returns Page
    else Path matches /api/v1/tasks
        Client->>Nginx: GET https://wad-capstone.silvaronna.my.id:8443/api/v1/tasks
        Nginx->>PM2_BE: Proxy Pass to http://localhost:3000/api/v1/tasks
        PM2_BE->>DB: Query via TCP port 3306 (Prisma Client)
        DB-->>PM2_BE: Returns rows
        PM2_BE-->>Nginx: Returns JSON response
        Nginx-->>Client: Returns JSON response
    else Path matches /socket.io/ (WebSocket)
        Client->>Nginx: WebSocket Handshake Upgrade (https://...:8443/socket.io/)
        Nginx->>PM2_BE: Proxy Pass to http://localhost:3000/socket.io/ (Connection: Upgrade)
        PM2_BE-->>Client: Websocket tunnel established
    end
```

### Complete Inbound Traffic Logic

1.  **Inbound Requests**: The server exposes port `8000` (HTTP) and port `8443` (HTTPS) to the public web through the UFW firewall.
2.  **HTTP to HTTPS Redirect**:
    *   Any request hitting Nginx on port `8000` matches the default virtual host server block.
    *   Nginx intercepts this request and immediately returns an HTTP `301 Moved Permanently` redirecting the client browser to the secure port `8443` on the same host:
        `return 301 https://$host:8443$request_uri;`
3.  **SSL/TLS Termination**:
    *   Nginx listens on port `8443 ssl` using Let's Encrypt certificates located at `/etc/letsencrypt/live/wad-capstone.silvaronna.my.id/`.
    *   Once Nginx performs the TLS handshake, it decrypts the incoming traffic and determines routing based on URI path matches.
4.  **Path Routing Rules**:
    *   **Frontend Routing (`/`)**: Requests targeting the root or assets are forwarded to the Vite development/preview server running under PM2 on `http://localhost:5173`. Headers such as `Host`, `X-Real-IP`, and `X-Forwarded-For` are appended.
    *   **API Routing (`/api/` & `/auth/`)**: API calls are routed to the Express application running under PM2 on `http://localhost:3000`. Express has `trust proxy` enabled (`app.set("trust proxy", 1)`), allowing the rate-limiting middleware to read proxy headers (`X-Forwarded-For`) to correctly track visitor IPs.
    *   **WebSocket Routing (`/socket.io/`)**: Connection upgrade requests are routed to the Node.js Socket.IO instance on port `3000`. Nginx applies specific WebSocket upgrade headers:
        ```nginx
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        ```
5.  **CORS Origin Security**:
    *   The browser blocks cross-origin requests unless allowed.
    *   The Express backend receives the request and checks the incoming `Origin` header against `.env` whitelist (`https://wad-capstone.silvaronna.my.id:8443`).
    *   If valid, the CORS middleware appends headers such as `Access-Control-Allow-Origin` and `Access-Control-Allow-Credentials: true`, allowing the React frontend to read the response.
6.  **Database Connection**:
    *   The backend connects to the MySQL instance running directly on the host port `3306` using TCP loopback socket connections handled by Prisma Client.

---

## 🚦 Local Development Setup

Follow these steps to run both backend and frontend components locally on your machine.

### 1. Database Setup
Ensure you have MySQL Server (or XAMPP) running. Create a database named `wadcapstone`:
```sql
CREATE DATABASE wadcapstone;
```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd wadv2
```
*   **Install Packages**: `npm install`
*   **Set Environment**: Copy `.env.example` to `.env` and set your credentials:
    ```env
    PORT=3000
    DATABASE_URL="mysql://root:yourpassword@localhost:3306/wadcapstone?allowPublicKeyRetrieval=true"
    JWT_ACCESS_SECRET=your_jwt_access_secret_key
    JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
    ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
    ```
*   **Run Migrations**: `npx prisma migrate deploy`
*   **Seed Database**: `node prisma/seed.js`
*   **Start Backend**: `npm start` (Runs on `http://localhost:3000`)

### 3. Frontend Setup
Open a new terminal window and navigate to the frontend directory:
```bash
cd wadv2-fe/wad-frontend
```
*   **Install Packages**: `npm install`
*   **Start Server**: `npm run dev` (Runs on `http://localhost:5173`)

---

## 🔐 Default Credentials (Database Seed)

For development testing, use these default seeded accounts:

| User | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Budi Santoso** | `budi@example.com` | `P@ssw0rd!` | `USER` |
| **Siti Rahayu** | `siti@example.com` | `P@ssw0rd!` | `USER` |
| **Admin WAD** | `admin@example.com` | `P@ssw0rd!` | `ADMIN` |

---

## 🔗 REST API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Log in user, return user object, set access & refresh tokens | No |
| `POST` | `/auth/refresh` | Rotate access token using refresh token | No |
| `POST` | `/auth/logout` | Revoke active refresh token | Yes |
| `GET` | `/api/v1/tasks` | Get all tasks (RBAC: regular users only see their own tasks) | Yes |
| `GET` | `/api/v1/tasks/:id` | Get single task details including attachments | Yes |
| `POST` | `/api/v1/tasks` | Create a new task | Yes |
| `PUT` | `/api/v1/tasks/:id` | Update task details (Joi-validated) | Yes |
| `DELETE` | `/api/v1/tasks/:id` | Delete task and all its attachments | Yes |
| `POST` | `/api/v1/media` | Create new attachment metadata | Yes |
| `DELETE` | `/api/v1/media/:id` | Remove attachment metadata | Yes |
| `GET` | `/api/v1/users` | List all users | Yes |

---

## ⚡ Socket.IO Events

*   `join_task_details (taskId)`: Joins the rooms for a specific task details page.
*   `leave_task_details (taskId)`: Leaves the task details room.
*   `online_count (count)`: Broadcasts the total number of connected users.
*   `task_updated (task)`: Emitted to all clients when a task is updated.
*   `task_deleted (taskId)`: Emitted to all clients when a task is deleted.
*   `attachment_added (data)`: Sent to task room when a file is attached.
*   `attachment_deleted (data)`: Sent to task room when a file is deleted.

---

## 📊 Database ERD (Entity Relationship Diagram)

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
