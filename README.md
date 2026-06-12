# 🚀 WAD Capstone API - Task Management System

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.16.0-brightgreen)](https://nodejs.org/)
[![Prisma Version](https://img.shields.io/badge/prisma-7.8.0-blue)](https://www.prisma.io/)
[![Express Version](https://img.shields.io/badge/express-5.2.1-lightgrey)](https://expressjs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

WAD Capstone API adalah backend service modern untuk sistem manajemen tugas (Task Management) yang dibangun menggunakan **Node.js**, **Express**, dan **Prisma ORM v7**. Project ini mendemonstrasikan implementasi RESTful API yang clean, scalable, dan terintegrasi dengan database MySQL.

---

## ✨ Fitur Utama

- **Authentication System**: Implementasi JWT (JSON Web Token) dengan Access Token & Refresh Token.
- **Advanced Security**: Password hashing menggunakan **Argon2id**, Refresh Token Rotation, dan **Reuse Detection**.
- **Media Management**: Fitur baru untuk mengelola attachment file (Media) yang tertaut ke Task dan User.
- **Multi-user Isolation**: Setiap user hanya dapat mengakses data task dan media milik mereka sendiri.
- **Full CRUD Tasks & Media**: Manajemen tugas dan file attachment lengkap.
- **Advanced Filtering & Sorting**: Filter berdasarkan status, prioritas, serta custom sorting.
- **Pagination**: Sistem pagination yang efisien untuk data Task dan Media.
- **Interactive Documentation**: Dokumentasi API lengkap menggunakan Swagger UI dengan dukungan Bearer Auth.
- **Prisma 7 Architecture**: Menggunakan Driver Adapter terbaru (`@prisma/adapter-mariadb`) untuk performa maksimal.

---

## 🛠️ Stack Teknologi

- **Runtime**: Node.js v22.x
- **Framework**: Express.js v5
- **ORM**: Prisma v7.8.0
- **Database**: MySQL (via XAMPP/Docker)
- **Security**: Argon2, JsonWebToken, UUID
- **Validation**: Joi
- **Documentation**: Swagger / OpenAPI 3.0

---

## 🚀 Instalasi & Setup

### 1. Clone Repositori
```bash
git clone https://github.com/silvaronna/wad-capstone.git
cd wadv2
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment
Buat file `.env` di root directory dan sesuaikan koneksi database serta secret JWT:
```env
PORT=3000
NODE_ENV=development
APP_NAME="WAD Capstone API"
APP_VERSION=1.0.0

# Database
DATABASE_URL="mysql://root@localhost:3306/wadcapstone"

# JWT Secrets
JWT_ACCESS_SECRET="your_access_secret_key"
JWT_REFRESH_SECRET="your_refresh_secret_key"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

### 4. Setup Database (Prisma)
Jalankan migrasi untuk sinkronisasi schema dan generate client:
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Seeding Data (Optional)
Gunakan script seeding untuk mengisi data awal (termasuk user test dengan password ter-hash):
```bash
npm run db:seed
```
*Note: Default password untuk user seed adalah `P@ssw0rd!`*

### 6. Jalankan Aplikasi
```bash
# Mode Development (dengan nodemon)
npm start

# Mode Produksi
npm run dev
```

---

## 📖 Dokumentasi API

Setelah server berjalan, Anda dapat mengakses dokumentasi interaktif di:
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

### Endpoint Utama (`/api/v1`)

#### 🔐 Autentikasi (`/auth`)
| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Registrasi user baru | No |
| `POST` | `/auth/login` | Login dan dapatkan Access & Refresh Token | No |
| `POST` | `/auth/refresh` | Refresh Access Token | No |
| `POST` | `/auth/logout` | Revoke Refresh Token (Logout) | No |
| `GET` | `/auth/me` | Dapatkan profil user saat ini | Yes |

#### 📝 Manajemen Task (`/tasks`)
| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | List task user + Pagination & Filter | Yes |
| `POST` | `/tasks` | Membuat task baru | Yes |
| `GET` | `/tasks/:id` | Detail task (termasuk media/attachments) | Yes |
| `PATCH` | `/tasks/:id` | Update sebagian data task | Yes |
| `DELETE` | `/tasks/:id` | Menghapus task | Yes |

#### 📁 Manajemen Media (`/media`)
| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/media` | List media/attachments | Yes |
| `POST` | `/media` | Menambahkan attachment baru ke Task | Yes |
| `GET` | `/media/:id` | Detail media | Yes |
| `DELETE` | `/media/:id` | Menghapus media | Yes |

---

## 🏗️ Struktur Folder
```text
/src
  ├── config/         # Konfigurasi (Prisma, App)
  ├── controllers/    # Logika handling request
  ├── docs/           # Konfigurasi Swagger
  ├── media/          # Fitur Media (Repository, Controller, Routes) 🆕
  ├── middleware/     # Middlewares (Auth, Validasi)
  ├── repositories/   # Abstraksi database untuk User & Task
  ├── routes/         # Definisi endpoint (Auth, Tasks, Users)
  ├── services/       # Logika bisnis (Auth service)
  └── validators/     # Schema validasi Joi
/prisma
  ├── schema.prisma   # Definisi model database (User, Task, Category, Attachment, RefreshToken)
  └── seed.js         # Script data awal dengan hashing Argon2
```

---

## 📄 Lisensi

Project ini dilisensikan di bawah **ISC License**.

---
Developed with joy by **silvaronna**
