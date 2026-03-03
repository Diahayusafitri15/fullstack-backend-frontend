# Projek PKL - API Modern Post & Auth

Sistem RESTful API untuk manajemen postingan dengan fitur autentikasi JWT dan Upload Gambar.

## Fitur Utama
- **CRUD Postingan**: Manajemen data judul, isi, dan gambar.
- **Autentikasi**: Register & Login menggunakan Argon2 hashing.
- **Security**: JWT Access & Refresh Token.
- **Dokumentasi**: Swagger UI interaktif.

## Cara Instalasi
1. Clone repositori ini.
2. Jalankan `npm install`.
3. Duplikat file `.env.example` menjadi `.env` dan sesuaikan konfigurasinya.
4. Pastikan PostgreSQL sudah berjalan dan database sudah dibuat.
5. Jalankan server dengan `node index.js` atau `npm start`.

## Endpoint Dokumentasi
Buka `http://localhost:3000/api-docs` setelah server berjalan.

# 🚀 Backend PKL - Post Management System

Sistem manajemen postingan sederhana yang sudah terintegrasi dengan **MinIO Object Storage** dan optimasi gambar otomatis.

## 🌟 Fitur Utama
* **Image Optimization**: Menggunakan `Sharp` untuk mengonversi setiap upload gambar menjadi format `.webp` secara otomatis guna menghemat ruang penyimpanan.
* **Cloud Storage**: Terintegrasi dengan **MinIO** (S3 Compatible) untuk manajemen file yang lebih skalabel dan aman.
* **Environment Configuration**: Penggunaan file `.env` untuk keamanan kredensial database dan storage.
* **Relational Database**: Menggunakan PostgreSQL untuk penyimpanan data yang terstruktur.

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Storage**: MinIO
- **Image Processing**: Sharp

## 📋 Prasyarat
Sebelum menjalankan, pastikan Anda memiliki:
- Node.js terinstall
- PostgreSQL berjalan
- MinIO server aktif (Port 9000 & 9001)

## 🚀 Cara Menjalankan
1. Clone repository
2. Install dependencies:
   ```bash
   npm install