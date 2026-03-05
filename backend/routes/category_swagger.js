module.exports = {
    paths: {
      // === BAGIAN POSTS (DENGAN PAGINATION & SEARCH) ===
      '/posts': {
        get: {
          tags: ['Posts'],
          summary: 'Ambil semua post (Mendukung Pagination & Search)',
          parameters: [
            {
              name: 'page',
              in: 'query',
              description: 'Nomor halaman yang ingin dibuka (Contoh: 1)',
              schema: { type: 'integer', default: 1 }
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Batas jumlah data per halaman (Contoh: 8)',
              schema: { type: 'integer', default: 8 }
            },
            {
              name: 'search',
              in: 'query',
              description: 'Kata kunci pencarian judul atau kategori',
              schema: { type: 'string' }
            }
          ],
          responses: { 
            200: { 
              description: 'Berhasil mengambil semua data',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'success' },
                      data: { type: 'array', items: { type: 'object' } },
                      total_items: { type: 'integer' },
                      total_pages: { type: 'integer' }
                    }
                  }
                }
              }
            } 
          }
        },
        post: {
          tags: ['Posts'],
          summary: 'Tambah post baru (Wajib Login)',
          security: [{ bearerAuth: [] }], 
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['judul', 'isi', 'gambar', 'category_id'],
                  properties: {
                    judul: { type: 'string', example: 'Judul Postingan Baru' },
                    isi: { type: 'string', example: 'Konten lengkap postingan...' },
                    category_id: { type: 'integer', example: 1 },
                    gambar: { type: 'string', format: 'binary' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Post berhasil dibuat' } }
        }
      },
      '/posts/{id}': {
        get: {
          tags: ['Posts'],
          summary: 'Ambil post berdasarkan ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Data ditemukan' } }
        },
        put: {
          tags: ['Posts'],
          summary: 'Update post (Wajib Login)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['judul', 'isi', 'category_id'],
                  properties: {
                    judul: { type: 'string' },
                    isi: { type: 'string' },
                    category_id: { type: 'integer' },
                    gambar: { type: 'string', format: 'binary' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Post berhasil diupdate' } }
        },
        delete: {
          tags: ['Posts'],
          summary: 'Hapus post (Wajib Login)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Post berhasil dihapus' } }
        }
      },
  
      // === BAGIAN CATEGORIES (SUPAYA MUNCUL LAGI) ===
      '/categories': {
        get: {
          tags: ['Categories'],
          summary: 'Lihat semua kategori',
          responses: { 200: { description: 'Berhasil mengambil daftar kategori' } }
        },
        post: {
          tags: ['Categories'],
          summary: 'Tambah kategori baru (Wajib Login)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nama_kategori'],
                  properties: {
                    nama_kategori: { type: 'string', example: 'Souvenir' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Kategori berhasil dibuat' } }
        }
      },
      '/categories/{id}': {
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
          responses: { 200: { description: 'Kategori diperbarui' } }
        },
        delete: {
          tags: ['Categories'],
          summary: 'Hapus kategori (Wajib Login)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Kategori dihapus' } }
        }
      }
    }
  };