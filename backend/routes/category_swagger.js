module.exports = {
    paths: {
        '/categories': {
            get: {
                tags: ['Categories'],
                summary: 'Ambil semua kategori',
                security: [],
                responses: { 200: { description: 'Sukses' } }
            },
            post: {
                tags: ['Categories'],
                summary: 'Tambah kategori (Wajib Login)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nama_kategori'],
                                properties: { nama_kategori: { type: 'string' } }
                            }
                        }
                    }
                },
                responses: { 201: { description: 'Dibuat' } }
            }
        },
        '/categories/{id}': {
            get: {
                tags: ['Categories'],
                summary: 'Ambil kategori by ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: { 200: { description: 'Ditemukan' } }
            },
            put: {
                tags: ['Categories'],
                summary: 'Update kategori (Wajib Login)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: { nama_kategori: { type: 'string' } }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Diperbarui' } }
            },
            delete: {
                tags: ['Categories'],
                summary: 'Hapus kategori (Wajib Login)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: { 200: { description: 'Dihapus' } }
            }
        }
    }
};