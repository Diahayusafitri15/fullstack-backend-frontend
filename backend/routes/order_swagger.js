module.exports = {
    paths: {
      // --- ENDPOINT UNTUK USER (CUSTOMER) ---
      '/orders': {
        post: {
          tags: ['Orders - User'],
          summary: 'Checkout pesanan baru',
          description: 'Digunakan oleh user untuk membuat pesanan souvenir baru.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    post_id: { type: 'integer', example: 1 },
                    qty: { type: 'integer', example: 2 },
                    total_bayar: { type: 'integer', example: 50000 },
                    provinsi: { type: 'string', example: 'Lampung' },
                    kota: { type: 'string', example: 'Bandar Lampung' },
                    kecamatan: { type: 'string', example: 'Rajabasa' },
                    desa: { type: 'string', example: 'Rajabasa Jaya' },
                    kode_pos: { type: 'string', example: '35144' },
                    alamat_lengkap: { type: 'string', example: 'Jl. Soekarno Hatta No. 10' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Pesanan berhasil dibuat ✨' },
            500: { description: 'Internal Server Error' }
          }
        }
      },
      '/orders/my-orders': {
        get: {
          tags: ['Orders - User'],
          summary: 'Lihat riwayat pesanan saya',
          description: 'Mengambil daftar semua pesanan berdasarkan token user yang sedang aktif.',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Daftar pesanan ditemukan' },
            401: { description: 'Unauthorized' }
          }
        }
      },
  
      // --- ENDPOINT KHUSUS KELOLA ADMIN ---
      '/orders/admin/all': {
        get: {
          tags: ['Orders - Admin'],
          summary: 'Lihat semua pesanan pelanggan',
          description: 'Hanya dapat diakses oleh admin untuk melihat rekap seluruh pesanan masuk.',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Berhasil mengambil semua data pesanan' }
          }
        }
      },
      '/orders/admin/status/{id}': {
        put: {
          tags: ['Orders - Admin'],
          summary: 'Update status pesanan',
          description: 'Mengubah status pesanan (contoh: pending, diproses, dikirim, selesai).',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID Pesanan yang akan diupdate',
              schema: { type: 'integer' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'diproses' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Status berhasil diperbarui ✅' }
          }
        }
      },
      '/orders/admin/delete/{id}': {
        delete: {
          tags: ['Orders - Admin'],
          summary: 'Hapus data pesanan',
          description: 'Menghapus data pesanan dari database berdasarkan ID.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID Pesanan yang akan dihapus',
              schema: { type: 'integer' }
            }
          ],
          responses: {
            200: { description: 'Pesanan berhasil dihapus 🗑️' }
          }
        }
      }
    }
  };