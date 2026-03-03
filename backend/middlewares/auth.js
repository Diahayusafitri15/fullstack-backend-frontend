const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Mengambil token setelah 'Bearer '

    if (!token) {
        return res.status(401).json({ 
            status: "error",
            message: "Token diperlukan! Silakan klik Authorize di Swagger." 
        });
    }

    try {
        // HARUS pakai ACCESS_TOKEN_SECRET agar sinkron dengan Login
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        // Error 403 muncul di sini jika token basi atau secret salah
        return res.status(403).json({ 
            status: "error", 
            message: "Token tidak valid atau sudah kadaluarsa. Silakan Login ulang." 
        });
    }
};