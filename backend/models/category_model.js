const pool = require('../config/db');

const Category = {
    // Ambil semua data
    getAll: async () => {
        const result = await pool.query('SELECT * FROM categories ORDER BY id DESC');
        return result.rows;
    },

    // Ambil berdasarkan ID
    getById: async (id) => {
        const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
        return result.rows[0];
    },

    // Simpan data baru
    create: async (nama_kategori) => {
        const result = await pool.query(
            'INSERT INTO categories (nama_kategori) VALUES ($1) RETURNING *',
            [nama_kategori]
        );
        return result.rows[0];
    },

    // Update data
    update: async (id, nama_kategori) => {
        const result = await pool.query(
            'UPDATE categories SET nama_kategori = $1 WHERE id = $2 RETURNING *',
            [nama_kategori, id]
        );
        return result.rows[0];
    },

    // Hapus data
    delete: async (id) => {
        const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
        return result.rowCount > 0;
    }
};

module.exports = Category;