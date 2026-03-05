const Post = require('../models/post');
const response = require('../utils/response');
const { validationResult } = require('express-validator');

// Ambil Base URL dari .env untuk menggabungkan path gambar
const baseUrl = process.env.MINIO_BASE_URL;

exports.getAll = async (req, res) => {
    try {
        // 1. Ambil parameter dari query URL, beri nilai default jika kosong
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const search = req.query.search || "";

        // 2. Panggil model dengan mengirimkan parameter tersebut
        const { rows, totalItems } = await Post.getAll(page, limit, search);

        // 3. Hitung total halaman
        const totalPages = Math.ceil(totalItems / limit);

        // 4. Map data agar gambar berisi URL lengkap
        const formattedData = rows.map(item => ({
            ...item,
            gambar: item.gambar ? `${baseUrl}/${item.gambar}` : null
        }));

        // 5. Kirim response lengkap dengan info pagination
        res.status(200).json({
            status: "success",
            message: "Data postingan berhasil diambil",
            data: formattedData,
            total_items: totalItems,
            total_pages: totalPages,
            current_page: page
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getById = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ message: "ID harus angka" });

    try {
        const data = await Post.getById(id);
        if (!data.rows[0]) return res.status(404).json({ message: "Data tidak ditemukan" });
        
        // Gabungkan path dari DB dengan Base URL
        const item = data.rows[0];
        if (item.gambar) item.gambar = `${baseUrl}/${item.gambar}`;

        response.success(res, item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Gunakan req.file.minioPath hasil perbaikan middleware sebelumnya
    if (!req.file || !req.file.minioPath) {
        return res.status(400).json({ message: "Gambar wajib diunggah" });
    }

    const { judul, isi, category_id } = req.body;
    const gambar = req.file.minioPath; // Hanya simpan path: "my-bucket/nama.webp"

    try {
        const data = await Post.create(judul, isi, gambar, category_id);
        
        // Kembalikan data dengan URL lengkap untuk respon Swagger
        const result = data.rows[0];
        result.gambar = `${baseUrl}/${result.gambar}`;

        response.success(res, result, 'Post berhasil dibuat. Path disimpan di DB, domain di .env');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { judul, isi, category_id } = req.body;

    try {
        const oldPost = await Post.getById(id);
        if (!oldPost.rows[0]) {
            return res.status(404).json({ message: "Post tidak ditemukan" });
        }

        let gambar = oldPost.rows[0].gambar;
        
        // Jika ada upload baru, ambil minioPath yang baru
        if (req.file && req.file.minioPath) {
            gambar = req.file.minioPath;
        }

        await Post.update(id, judul, isi, gambar, category_id);
        response.success(res, null, 'Post berhasil diupdate');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.remove = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.getById(id);
        if (post.rows[0]) {
            await Post.remove(id);
            response.success(res, null, 'Post berhasil dihapus');
        } else {
            res.status(404).json({ message: "Post tidak ditemukan" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};