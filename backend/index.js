require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./utils/swagger');
const path = require('path');

// =======================
// IMPORT ROUTES
// =======================
const userRoutes = require('./routes/user_route');
const postRoutes = require('./routes/post_route');
const categoryRoutes = require('./routes/category_route');
const orderRoutes = require('./routes/order_route');

const app = express();
const PORT = process.env.PORT || 3000;

// =======================
// MIDDLEWARE
// =======================
// Perbaikan CORS: Agar lebih aman dan stabil saat pertukaran token
app.use(cors({
    origin: '*', // Di fase dev bisa pakai '*', kalau sudah deploy ganti ke domain frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// STATIC FILE
// =======================
app.use('/public', express.static(path.join(__dirname, 'public')));

// =======================
// ROUTES (DENGAN PREFIX /API)
// =======================
/**
 * PENTING: Saya menambahkan '/api' agar sesuai dengan variabel 
 * API_BASE_URL = "http://localhost:3000/api" di frontend kamu.
 */
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes); 

// =======================
// SWAGGER DOCUMENTATION
// =======================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// =======================
// ROOT ENDPOINT
// =======================
app.get('/', (req, res) => {
    res.send('🚀 Server API PKL siap digunakan!');
});

// =======================
// ERROR HANDLER 404
// =======================
app.use((req, res, next) => {
    res.status(404).json({
        status: "error",
        message: `Endpoint ${req.originalUrl} tidak ditemukan pada server ini.`
    });
});

// =======================
// GLOBAL ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err.stack);
    res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan internal pada server",
        error: process.env.NODE_ENV === 'development' ? err.message : {} // Tampilkan detail hanya saat dev
    });
});

// =======================
// START SERVER
// =======================
app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📖 Swagger UI: http://localhost:${PORT}/api-docs`);
    console.log(`🛠️  API Base URL: http://localhost:${PORT}/api`);
    console.log(`=========================================\n`);
});