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

// --- MIDDLEWARE ---
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyediakan akses folder publik untuk gambar lokal (jika ada)
app.use('/public', express.static(path.join(__dirname, 'public')));

// --- KONFIGURASI ROUTE ---
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/categories', categoryRoutes);

// --- DOKUMENTASI SWAGGER ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send('🚀 Server API PKL siap digunakan!');
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📖 Swagger UI: http://localhost:${PORT}/api-docs\n`);
});