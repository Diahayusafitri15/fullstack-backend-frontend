require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./utils/swagger');
const path = require('path');

// 1. Pastikan folder 'routes' ada dan nama filenya sama persis
const userRoutes = require('./routes/user_route');
const postRoutes = require('./routes/post_route');
const categoryRoutes = require('./routes/category_route');

const app = express();
const PORT = process.env.PORT || 3000;


// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =======================
// STATIC FILE
// =======================
// Menyediakan akses folder publik untuk gambar lokal (jika ada)
app.use('/public', express.static(path.join(__dirname, 'public')));


// =======================
// ROUTES
// =======================
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/categories', categoryRoutes);


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
        message: "Endpoint tidak ditemukan"
    });
});


// =======================
// GLOBAL ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan pada server"
    });
});


// =======================
// START SERVER
// =======================
app.listen(PORT, () => {
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📖 Swagger UI: http://localhost:${PORT}/api-docs`);
});