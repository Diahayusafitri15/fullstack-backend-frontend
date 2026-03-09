const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const argon2 = require("argon2");

// ==========================
// KONEKSI DATABASE
// ==========================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Pastikan .env mengarah ke database 'pkl'
});

// ==========================
// REGISTER (Daftar Akun Baru)
// ==========================
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Cek duplikasi email
    const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // 2. Hash password menggunakan Argon2
    const hashedPassword = await argon2.hash(password);

    // 3. Tentukan role otomatis (Default: USER, jika ada kata admin jadi ADMIN)
    const role = email.toLowerCase().includes("admin") ? "ADMIN" : "USER";

    // 4. Masukkan ke tabel 'users'
    const newUser = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [email, hashedPassword, role]
    );

    res.status(201).json({
      message: "Register berhasil!",
      user: newUser.rows[0]
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// LOGIN (Masuk ke Sistem)
// ==========================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Cari user berdasarkan email
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    // 2. Jika user tidak ditemukan
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // 3. Verifikasi Password Hash
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return res.status(401).json({ message: "Password salah" });
    }

    // 4. Generate Token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login berhasil",
      token,
      refreshToken,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// FITUR KOMENTAR
// ==========================

// 1. Tambah Komentar (User)
const addComment = async (req, res) => {
  try {
    const { postId, comment, rating } = req.body;
    const userEmail = req.user.email;

    const newComment = await pool.query(
      "INSERT INTO comments (post_id, email, comment, rating, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
      [parseInt(postId), userEmail, comment, parseInt(rating) || 5]
    );

    res.status(201).json({
      message: "Komentar berhasil dikirim!",
      data: newComment.rows[0]
    });

  } catch (error) {
    res.status(500).json({ message: "Gagal mengirim komentar: " + error.message });
  }
};

// 2. Ambil Komentar per Postingan (Publik)
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const result = await pool.query("SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC", [postId]);
    
    res.status(200).json({
      status: "success",
      total: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Ambil SEMUA Komentar (Khusus Admin - Dashboard)
const getAllComments = async (req, res) => {
  try {
    // Keamanan: Cek apakah yang minta benar-benar ADMIN
    if (req.user.role.toUpperCase() !== "ADMIN") {
      return res.status(403).json({ message: "Akses ditolak! Khusus Admin." });
    }

    const result = await pool.query("SELECT * FROM comments ORDER BY created_at DESC");
    
    res.status(200).json({
      status: "success",
      total: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Hapus Komentar (Admin atau Pemilik)
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params; 
    const userEmail = req.user.email;
    const userRole = req.user.role.toUpperCase();

    // Cek keberadaan komentar
    const commentCheck = await pool.query("SELECT * FROM comments WHERE id = $1", [id]);
    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ message: "Komentar tidak ditemukan" });
    }

    const commentData = commentCheck.rows[0];

    // Logika Izin
    if (userRole === "ADMIN" || commentData.email === userEmail) {
      await pool.query("DELETE FROM comments WHERE id = $1", [id]);
      return res.status(200).json({ message: "Komentar berhasil dihapus" });
    } else {
      return res.status(403).json({ 
        message: "Akses ditolak! Kamu hanya bisa menghapus komentarmu sendiri." 
      });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// TOKEN REFRESH
// ==========================
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Token diperlukan" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

    res.status(200).json({ token: newToken });
  } catch (error) {
    res.status(403).json({ message: "Token tidak valid" });
  }
};

module.exports = {
  register,
  login,
  refresh,
  addComment,
  getCommentsByPost,
  getAllComments, // <--- Sudah ditambahkan
  deleteComment
};