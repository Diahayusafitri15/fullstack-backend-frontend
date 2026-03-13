const jwt = require("jsonwebtoken");

/**
 * ===============================
 * VERIFY TOKEN (CEK LOGIN USER)
 * ===============================
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // cek apakah header ada
  if (!authHeader) {
    return res.status(401).json({
      status: "error",
      message: "Authorization header tidak ditemukan. Silakan login."
    });
  }

  // ambil token dari Bearer
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Token diperlukan!"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // simpan data user ke request
    req.user = decoded;

    console.log("TOKEN DATA:", decoded);

    next();
  } catch (error) {
    return res.status(403).json({
      status: "error",
      message: "Token tidak valid atau sudah kadaluarsa."
    });
  }
};


/**
 * ===============================
 * CEK ROLE ADMIN
 * ===============================
 */
const isAdmin = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "User tidak ditemukan pada token."
    });
  }

  const role = req.user.role ? req.user.role.toLowerCase() : null;

  console.log("USER ROLE:", role);

  if (role === "admin") {
    next();
  } else {
    return res.status(403).json({
      status: "error",
      message: "Akses ditolak! Halaman ini hanya untuk ADMIN."
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin
};