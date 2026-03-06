const jwt = require("jsonwebtoken");

// Penyimpanan sementara (Memory Storage)
let users = [];
let comments = [];

// ==========================
// REGISTER
// ==========================
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      return res.status(400).json({
        message: "Email sudah terdaftar"
      });
    }

    const newUser = {
      id: users.length + 1,
      email,
      password,
      role: email.includes("admin") ? "ADMIN" : "USER" // Otomatis jadi Admin jika email ada kata 'admin'
    };

    users.push(newUser);

    res.status(201).json({
      message: "Register berhasil",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ==========================
// LOGIN
// ==========================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan"
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Password salah"
      });
    }

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
    res.status(500).json({
      message: error.message
    });
  }
};

// ==========================
// REFRESH TOKEN
// ==========================
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token diperlukan"
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const newToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token: newToken
    });

  } catch (error) {
    res.status(403).json({
      message: "Refresh token tidak valid"
    });
  }
};

// ==========================================
// FITUR KOMENTAR & RATING (TAMBAHAN BARU)
// ==========================================

// 1. TAMBAH KOMENTAR (User harus login)
const addComment = async (req, res) => {
  try {
    const { postId, comment, rating } = req.body;
    
    // req.user didapat dari middleware verifyToken
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const newComment = {
      id: comments.length + 1,
      postId: parseInt(postId),
      email: user.email, // Ambil email dari data login
      comment,
      rating: parseInt(rating) || 5, // Default rating 5 jika kosong
      createdAt: new Date().toISOString()
    };

    comments.push(newComment);

    res.status(201).json({
      message: "Komentar dan Rating berhasil dikirim!",
      data: newComment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. LIHAT KOMENTAR (Berdasarkan ID Postingan)
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const result = comments.filter(c => c.postId === parseInt(postId));
    
    res.status(200).json({
      status: "success",
      total: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. DELETE KOMENTAR (Khusus Admin)
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Proteksi: Cek apakah role-nya ADMIN
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Akses ditolak! Hanya Admin yang bisa menghapus komentar."
      });
    }

    const initialLength = comments.length;
    comments = comments.filter(c => c.id !== parseInt(id));

    if (comments.length === initialLength) {
      return res.status(404).json({ message: "Komentar tidak ditemukan" });
    }

    res.status(200).json({
      message: "Komentar berhasil dihapus oleh Admin"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  refresh,
  addComment,
  getCommentsByPost,
  deleteComment
};