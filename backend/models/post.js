const pool = require('../config/db');

class Post {
    static async getAll() {
        return await pool.query(`
            SELECT posts.*, categories.nama_kategori 
            FROM posts 
            LEFT JOIN categories ON posts.category_id = categories.id 
            ORDER BY posts.id DESC
        `);
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