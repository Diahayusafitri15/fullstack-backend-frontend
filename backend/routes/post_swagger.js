module.exports = {
    paths: {
        // PERBAIKAN: Gunakan path '/' karena prefix '/posts' sudah diatur di index.js
        // Namun jika di index.js menggunakan app.use('/posts', postRoutes), 
        // maka di sini cukup '/' atau sesuaikan agar tidak double /posts/posts
        '/posts': {
            get: {
                tags: ['Posts'],
                summary: 'Ambil semua post',
                // Endpoint ini bisa diakses tanpa login (Tanpa Login)
                security: [], 
                responses: { 
                    200: { description: 'Berhasil mengambil semua data' } 
                }
            },
            post: {
                tags: ['Posts'],
                summary: 'Tambah post baru (Wajib Login)',
                // Menggunakan pengamanan JWT
                security: [{ bearerAuth: [] }], 
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                // SEMUA WAJIB ISI: Judul, Isi, Gambar, dan Kategori
                                required: ['judul', 'isi', 'gambar', 'category_id'],
                                properties: {
                                    judul: { 
                                        type: 'string',
                                        minLength: 1,
                                        example: 'Judul Berita Terbaru' 
                                    },
                                    isi: { 
                                        type: 'string',
                                        minLength: 1,
                                        example: 'Konten lengkap berita ada di sini...' 
                                    },
                                    category_id: { 
                                        type: 'integer',
                                        description: 'ID Kategori (Lihat di tabel categories)',
                                        example: 1
                                    },
                                    gambar: { 
                                        type: 'string', 
                                        format: 'binary',
                                        description: 'File gambar wajib diunggah (Format: jpg/png)'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: { 
                    201: { description: 'Post berhasil dibuat' },
                    400: { description: 'Data tidak lengkap atau format salah' },
                    401: { description: 'Akses ditolak! Belum login' } //
                }
            }
        },

        '/posts/{id}': {
            get: {
                tags: ['Posts'],
                summary: 'Ambil post berdasarkan ID',
                parameters: [{ 
                    name: 'id', 
                    in: 'path', 
                    required: true, 
                    schema: { type: 'integer' } 
                }],
                responses: { 
                    200: { description: 'Data ditemukan' },
                    404: { description: 'Data tidak ditemukan' }
                }
            },
            put: {
                tags: ['Posts'],
                summary: 'Update post (Wajib Login)',
                security: [{ bearerAuth: [] }],
                parameters: [{ 
                    name: 'id', 
                    in: 'path', 
                    required: true,
                    schema: { type: 'integer' }
                }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                required: ['judul', 'isi', 'category_id'],
                                properties: {
                                    judul: { type: 'string', minLength: 1 },
                                    isi: { type: 'string', minLength: 1 },
                                    category_id: { type: 'integer' },
                                    gambar: { 
                                        type: 'string', 
                                        format: 'binary',
                                        description: 'Kosongkan jika tidak ingin mengubah gambar'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: { 
                    200: { description: 'Post berhasil diupdate' },
                    404: { description: 'Post tidak ditemukan' },
                    403: { description: 'Token tidak valid' }
                }
            },
            delete: {
                tags: ['Posts'],
                summary: 'Hapus post (Wajib Login)',
                security: [{ bearerAuth: [] }],
                parameters: [{ 
                    name: 'id', 
                    in: 'path', 
                    required: true,
                    schema: { type: 'integer' }
                }],
                responses: { 
                    200: { description: 'Post berhasil dihapus' },
                    403: { description: 'Token kadaluarsa atau tidak valid' },
                    404: { description: 'Post tidak ditemukan' }
                }
            }
        }
    }
};