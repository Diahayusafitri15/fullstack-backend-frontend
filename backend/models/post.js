const pool = require('../config/db');

class Post {
    static async getAll(page, limit, search) {
        const offset = (page - 1) * limit;
        const searchQuery = `%${search}%`;

        const dataQuery = `
            SELECT posts.*, categories.nama_kategori 
            FROM posts 
            LEFT JOIN categories ON posts.category_id = categories.id 
            WHERE posts.judul ILIKE $1 OR categories.nama_kategori ILIKE $1
            ORDER BY posts.id DESC
            LIMIT $2 OFFSET $3
        `;

        const countQuery = `
            SELECT COUNT(*) as total 
            FROM posts 
            LEFT JOIN categories ON posts.category_id = categories.id
            WHERE posts.judul ILIKE $1 OR categories.nama_kategori ILIKE $1
        `;

        const data = await pool.query(dataQuery, [searchQuery, limit, offset]);
        const count = await pool.query(countQuery, [searchQuery]);

        return {
            rows: data.rows,
            totalItems: parseInt(count.rows[0].total)
        };
    }

    static async getById(id) {
        return await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    }

    static async create(judul, isi, gambar, category_id) {
        return await pool.query(
            'INSERT INTO posts (judul, isi, gambar, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [judul, isi, gambar, category_id]
        );
    }

    static async update(id, judul, isi, gambar, category_id) {
        return await pool.query(
            'UPDATE posts SET judul = $1, isi = $2, gambar = $3, category_id = $4 WHERE id = $5',
            [judul, isi, gambar, category_id, id]
        );
    }

    static async remove(id) {
        return await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    }
}

module.exports = Post;