const pool = require("../config/db");

class Post {

  // =========================
  // GET ALL POSTS (With Pagination & Search)
  // =========================
  static async getAll(page = 1, limit = 8, search = "") {
    const offset = (page - 1) * limit;
    const searchQuery = `%${search}%`;

    const dataQuery = `
      SELECT 
        posts.*, 
        categories.nama_kategori
      FROM posts
      LEFT JOIN categories 
        ON posts.category_id = categories.id
      WHERE 
        posts.judul ILIKE $1
        OR categories.nama_kategori ILIKE $1
      ORDER BY posts.id DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM posts
      LEFT JOIN categories
        ON posts.category_id = categories.id
      WHERE 
        posts.judul ILIKE $1
        OR categories.nama_kategori ILIKE $1
    `;

    try {
      const data = await pool.query(dataQuery, [searchQuery, limit, offset]);
      const count = await pool.query(countQuery, [searchQuery]);

      return {
        rows: data.rows,
        totalItems: parseInt(count.rows[0].total) || 0
      };
    } catch (error) {
      throw new Error("Gagal mengambil data posts: " + error.message);
    }
  }

  // =========================
  // GET POST BY ID
  // =========================
  static async getById(id) {
    const query = `
      SELECT 
        posts.*, 
        categories.nama_kategori
      FROM posts
      LEFT JOIN categories
        ON posts.category_id = categories.id
      WHERE posts.id = $1
    `;
    // Mengembalikan result object agar .rows[0] bisa diakses di controller
    return pool.query(query, [id]);
  }

  // =========================
  // CREATE POST
  // =========================
  static async create(judul, isi, harga, gambar, category_id) {
    const query = `
      INSERT INTO posts
      (judul, isi, harga, gambar, category_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    // Pastikan harga adalah angka desimal/float yang valid
    const cleanHarga = parseFloat(harga) || 0;
    const cleanCategoryId = category_id ? parseInt(category_id) : null;

    const values = [
      judul || "Tanpa Judul",
      isi || "",
      cleanHarga,
      gambar || null,
      cleanCategoryId
    ];

    return pool.query(query, values);
  }

  // =========================
  // UPDATE POST
  // =========================
  static async update(id, judul, isi, harga, gambar, category_id) {
    const query = `
      UPDATE posts
      SET
        judul = $1,
        isi = $2,
        harga = $3,
        gambar = $4,
        category_id = $5
      WHERE id = $6
      RETURNING *
    `;

    // Konversi tipe data untuk mencegah error PostgreSQL
    const cleanHarga = parseFloat(harga) || 0;
    const cleanCategoryId = category_id ? parseInt(category_id) : null;

    const values = [
      judul,
      isi,
      cleanHarga,
      gambar, // Jika controller mengirim gambar lama/baru, akan masuk ke sini
      cleanCategoryId,
      id
    ];

    return pool.query(query, values);
  }

  // =========================
  // DELETE POST
  // =========================
  static async remove(id) {
    const query = `
      DELETE FROM posts
      WHERE id = $1
      RETURNING *
    `;
    return pool.query(query, [id]);
  }
}

module.exports = Post;