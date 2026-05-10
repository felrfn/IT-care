# IT Care

**IT Care** adalah aplikasi helpdesk internal untuk pengelolaan keluhan IT karyawan. Aplikasi ini dibangun menggunakan Node.js, Express.js, PostgreSQL, EJS, dan Bootstrap.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL / Neon
- EJS
- Bootstrap 5
- bcrypt
- express-session
- connect-pg-simple
- pg

## Prerequisites

Pastikan sudah terpasang:

- Node.js 18 atau lebih baru
- npm
- Git
- Akun dan database Neon PostgreSQL

## Installation

Clone repository:

```bash
git clone https://github.com/haidarpriatama/IT-care.git
cd IT-care
```

Install dependencies:

```bash
npm install
```

Buat file environment:

```bash
cp .env.example .env
```

Isi file `.env`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
SESSION_SECRET=change_this_to_a_random_secret
```

Jalankan migrasi/schema database:

```bash
npm run db:schema
```

Isi data awal:

```bash
npm run db:seed
```

Jalankan aplikasi:

```bash
npm run dev
```

Aplikasi akan berjalan di:

```text
http://localhost:3000
```

## Demo Accounts

Setelah menjalankan seed, gunakan akun berikut untuk login:

| Role     | Email              | Password |
| -------- | ------------------ | -------- |
| Admin    | admin@itcare.id    | password |
| Teknisi  | teknisi@itcare.id  | password |
| Karyawan | karyawan@itcare.id | password |

## Available Scripts

```bash
npm run dev       # menjalankan aplikasi dalam mode development
npm start         # menjalankan aplikasi dalam mode production/local
npm run db:schema # membuat tabel database
npm run db:seed   # mengisi data awal
```

## Environment Variables

| Variable         | Description                            |
| ---------------- | -------------------------------------- |
| `PORT`           | Port aplikasi Express                  |
| `NODE_ENV`       | Environment aplikasi                   |
| `DATABASE_URL`   | Connection string PostgreSQL dari Neon |
| `SESSION_SECRET` | Secret key untuk session               |

## Database Setup Notes

Project ini menggunakan PostgreSQL melalui package `pg`. Semua tabel dibuat dari file:

```text
src/database/schema.sql
```

Data awal berada pada file:

```text
src/database/seed.sql
```

Pastikan `DATABASE_URL` sudah mengarah ke database Neon yang benar sebelum menjalankan script database.

## Project Structure

```text
src/
├── app.js
├── config/
├── controllers/
├── database/
├── middlewares/
├── public/
├── routes/
└── views/
```

---

## API

### Health

- `GET /` – Pemeriksaan status API (`{ message: "IT Care API is running" }`)

### Auth

- `POST /api/auth/login` – Login (membuat session)
- `POST /api/auth/register` – Registrasi user
- `POST /api/auth/logout` – Logout (menghapus session)
- `GET /api/auth/me` – Mengambil data user yang sedang login (dari session)

### Dashboard

- `GET /api/dashboard` – Statistik dashboard + tiket terbaru (sesuai role)

### Tickets

- `GET /api/tickets` – Daftar tiket
- `POST /api/tickets` – Membuat tiket (role: `admin`, `karyawan`)
- `GET /api/tickets/:id` – Detail tiket + catatan + log + daftar teknisi (untuk admin/teknisi)
- `PUT /api/tickets/:id` – Update tiket (tergantung role)
- `DELETE /api/tickets/:id` – Pindah ke trash

### Catatan Tiket

- `POST /api/tickets/:id/notes` – Menambahkan catatan (komen) pada tiket

### Log Tiket / Notifikasi

- `GET /api/tickets/api/logs` – Log status terbaru buat user yang login (limit 5)

### Trash (Admin)

- `GET /api/tickets/trash/all` – Daftar tiket di trash (admin)
- `POST /api/tickets/:id/restore` – Restore tiket (admin)
- `DELETE /api/tickets/:id/hard` – Menghapus tiket secara permanen (admin)

### Kategori

- `GET /api/categories` – Daftar kategori
- `POST /api/categories` – Membuat kategori (role: `admin`, `teknisi`)
- `PUT /api/categories/:id` – Update kategori (role: `admin`, `teknisi`)
- `DELETE /api/categories/:id` – Hapus kategori (role: `admin`, `teknisi`)

### Pengguna (Admin)

- `GET /api/users` – Daftar user
- `POST /api/users` – Membuat user
- `PUT /api/users/:id` – Update user
- `DELETE /api/users/:id` – Hapus user

### Laporan

- `GET /api/reports` – Laporan + ringkasan + statistik kategori + daftar kategori (role: `admin`, `teknisi`)

## Important Notes

File `.env` tidak boleh di-commit ke repository. Gunakan `.env.example` sebagai template konfigurasi.

---

IT Care — Internal IT Helpdesk System
