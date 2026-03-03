const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan gambar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Pastikan folder public/images sudah dibuat
    },
    filename: (req, file, cb) => {
        // Memberi nama unik: timestamp + ekstensi file asli
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;