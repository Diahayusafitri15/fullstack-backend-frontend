const jwt = require("jsonwebtoken");

// ==========================
// LOGIN (Versi Simple)
// ==========================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tidak cek database (sementara seperti versi lama Swagger)
    // Semua email & password diterima

    const user = {
      id: 1,
      role: "ADMIN", // bisa kamu ubah jadi "USER" kalau mau test user
    };

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      status: "success",
      token,
      refreshToken,
      role: user.role,
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
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
        message: "Refresh token diperlukan",
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
      status: "success",
      token: newToken,
    });

  } catch (error) {
    res.status(403).json({
      message: "Refresh token tidak valid atau kadaluarsa",
    });
  }
};

module.exports = {
  login,
  refresh,
};