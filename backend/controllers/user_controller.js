const jwt = require('jsonwebtoken');

// Fungsi Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Ganti dengan logika pengecekan database kamu
        const userId = 1; 

        // MEMAKAI ACCESS_TOKEN_SECRET sesuai .env
        const token = jwt.sign(
            { id: userId }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '1d' }
        );

        const refreshToken = jwt.sign(
            { id: userId }, 
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: '7d' }
        );
        
        res.status(200).json({ status: "success", token, refreshToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi Refresh Token
const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: "Token diperlukan" });

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newToken = jwt.sign(
            { id: decoded.id }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({ status: "success", token: newToken });
    } catch (error) {
        res.status(403).json({ message: "Refresh token tidak valid atau kadaluarsa" });
    }
};

// Pastikan di-export dengan benar agar tidak TypeError
module.exports = {
    login,
    refresh
};