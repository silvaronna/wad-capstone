# 🚀 WAD Capstone API - Task Management System

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.16.0-brightgreen)](https://nodejs.org/)
[![Prisma Version](https://img.shields.io/badge/prisma-7.8.0-blue)](https://www.prisma.io/)
[![Express Version](https://img.shields.io/badge/express-5.2.1-lightgrey)](https://expressjs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

WAD Capstone API adalah backend service modern untuk sistem manajemen tugas (Task Management) yang dibangun menggunakan **Node.js**, **Express**, dan **Prisma ORM v7**. Project ini mendemonstrasikan implementasi RESTful API yang clean, scalable, dan terintegrasi dengan database MySQL.

---

## ✨ Fitur Utama

- **Full CRUD Tasks**: Manajemen tugas lengkap dengan status dan prioritas.
- **Advanced Filtering & Sorting**: Filter berdasarkan status, prioritas, serta custom sorting (createdAt, title, dll).
- **Pagination**: Sistem pagination yang efisien untuk handle data dalam jumlah besar.
- **Relational Data**: Integrasi relasi antara User, Task, dan Category.
- **Robust Validation**: Validasi input ketat menggunakan Joi Middleware.
- **Interactive Documentation**: Dokumentasi API lengkap menggunakan Swagger UI.
- **Prisma 7 Architecture**: Menggunakan Driver Adapter terbaru (`@prisma/adapter-mariadb`) untuk performa maksimal.

---

## 🛠️ Stack Teknologi

- **Runtime**: Node.js v22.x
- **Framework**: Express.js v5
- **ORM**: Prisma v7.8.0
- **Database**: MySQL (via XAMPP/Docker)
- **Validation**: Joi
- **Documentation**: Swagger / OpenAPI 3.0
- **Development**: Nodemon, Dotenv

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
Buat file `.env` di root directory dan sesuaikan koneksi database Anda:
```env
PORT=3000
NODE_ENV=development
APP_NAME="WAD Capstone API"
APP_VERSION=1.0.0

# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="mysql://root:password@localhost:3306/wadcapstone"
```

### 4. Setup Database (Prisma)
Jalankan migrasi untuk membuat tabel di MySQL:
```bash
npx prisma migrate dev --name init_schema
```

*(Opsional)* Seed data awal:
```bash
npm run db:seed
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

### Endpoint Populer

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/v1/tasks` | List semua task + Pagination & Filter |
| `POST` | `/api/v1/tasks` | Membuat task baru |
| `GET` | `/api/v1/tasks/:id` | Detail task berdasarkan ID |
| `PATCH` | `/api/v1/tasks/:id` | Update sebagian data task |
| `DELETE` | `/api/v1/tasks/:id` | Menghapus task |
| `GET` | `/api/v1/users/:userId/tasks` | Get semua task milik user tertentu (JOIN) |

---

## 🏗️ Struktur Folder
```text
/src
  ├── config/         # Konfigurasi (Prisma, App)
  ├── controllers/    # Logika handling request
  ├── data/           # Mock data (jika ada)
  ├── docs/           # Konfigurasi Swagger
  ├── middleware/     # Global/Route middlewares (Validasi)
  ├── repositories/   # Abstraksi akses database (Prisma logic)
  ├── routes/         # Definisi endpoint API
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
