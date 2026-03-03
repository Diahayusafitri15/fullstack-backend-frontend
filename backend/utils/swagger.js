const userSwagger = require('../routes/user_swagger');
const postSwagger = require('../routes/post_swagger');
const categorySwagger = require('../routes/category_swagger');

module.exports = {
    openapi: '3.0.0',
    info: {
        title: 'API PKL POLINELA 2026',
        version: '1.0.0',
        description: 'Dokumentasi API Sistem Blog (User, Post, & Category) - Proyek PKL'
    },
    servers: [
        { 
            url: 'http://localhost:3000',
            description: 'Local Development Server'
        }
    ],
    components: {
        securitySchemes: {
            // Konfigurasi Bearer Token agar muncul tombol Authorize
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    },
    // Mengaktifkan keamanan JWT secara global pada dokumentasi
    security: [{ bearerAuth: [] }], 
    paths: {
        // Menggabungkan semua path dari file swagger terpisah
        ...userSwagger.paths,
        ...postSwagger.paths,
        ...categorySwagger.paths
    }
};