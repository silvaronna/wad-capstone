# 🚀 WAD Capstone API - Task Management System

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.16.0-brightgreen)](https://nodejs.org/)
[![Prisma Version](https://img.shields.io/badge/prisma-7.8.0-blue)](https://www.prisma.io/)
[![Express Version](https://img.shields.io/badge/express-5.2.1-lightgrey)](https://expressjs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

WAD Capstone API adalah backend service modern untuk sistem manajemen tugas (Task Management) yang dibangun menggunakan **Node.js**, **Express**, dan **Prisma ORM v7**. Project ini mendemonstrasikan implementasi RESTful API yang clean, scalable, dan terintegrasi dengan database MySQL.

---

## ✨ Fitur Utama

- **Authentication System**: Implementasi JWT (JSON Web Token) dengan Access Token & Refresh Token.
- **Advanced Security**: Password hashing menggunakan **Argon2id**, Refresh Token Rotation, dan **Reuse Detection** untuk keamanan maksimal.
- **Multi-user Isolation**: Setiap user hanya dapat mengakses dan mengelola data task milik mereka sendiri.
- **Full CRUD Tasks**: Manajemen tugas lengkap dengan status dan prioritas.
- **Advanced Filtering & Sorting**: Filter berdasarkan status, prioritas, serta custom sorting (createdAt, title, dll).
- **Pagination**: Sistem pagination yang efisien untuk handle data dalam jumlah besar.
- **Interactive Documentation**: Dokumentasi API lengkap menggunakan Swagger UI.
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
git clone https://github.com/username/wadv2.git
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
Jalankan migrasi untuk sinkronisasi schema:
```bash
npx prisma migrate dev --name add_refresh_token
npx prisma generate
```

### 5. Jalankan Aplikasi
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

### Endpoint Utama

#### 🔐 Autentikasi (`/auth`)
| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Registrasi user baru | No |
| `POST` | `/auth/login` | Login dan dapatkan Access & Refresh Token | No |
| `POST` | `/auth/refresh` | Refresh Access Token menggunakan Refresh Token | No |
| `POST` | `/auth/logout` | Revoke Refresh Token (Logout) | No |
| `GET` | `/auth/me` | Dapatkan profil user yang sedang login | Yes |

#### 📝 Manajemen Task (`/api/v1/tasks`)
| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/tasks` | List task user + Pagination & Filter | Yes |
| `POST` | `/api/v1/tasks` | Membuat task baru | Yes |
| `GET` | `/api/v1/tasks/:id` | Detail task berdasarkan ID | Yes |
| `PATCH` | `/api/v1/tasks/:id` | Update sebagian data task | Yes |
| `DELETE` | `/api/v1/tasks/:id` | Menghapus task | Yes |

---

## 🏗️ Struktur Folder
```text
/src
  ├── config/         # Konfigurasi (Prisma, App)
  ├── controllers/    # Logika handling request
  ├── docs/           # Konfigurasi Swagger
  ├── middleware/     # Global/Route middlewares (Auth, Validasi)
  ├── repositories/   # Abstraksi akses database (Prisma logic)
  ├── routes/         # Definisi endpoint API
  ├── services/       # Logika bisnis (Auth service)
  └── validators/     # Schema validasi Joi
/prisma
  ├── schema.prisma   # Definisi model database
  └── seed.js         # Script data awal
```

---

## 🤝 Kontribusi

1. Fork project ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📄 Lisensi

Project ini dilisensikan di bawah **ISC License**.

---
Developed with joy by **silvaronna**
