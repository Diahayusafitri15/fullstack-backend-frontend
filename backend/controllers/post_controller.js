const Post = require('../models/post');
const response = require('../utils/response');
const { validationResult } = require('express-validator');
const pool = require('../config/db'); 

const baseUrl = process.env.MINIO_BASE_URL;

exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const search = req.query.search || "";

        const { rows, totalItems } = await Post.getAll(page, limit, search);

        // --- PERBAIKAN: Ambil jumlah komentar dengan konversi tipe data yang aman ---
        const formattedData = await Promise.all(rows.map(async (item) => {
            const commentCountResult = await pool.query(
                "SELECT COUNT(*) as total FROM comments WHERE post_id = $1", 
                [item.id]
            );
            
            return {
                ...item,
                gambar: item.gambar ? `${baseUrl}/${item.gambar}` : null,
                // Pastikan di-parse ke Integer agar frontend tidak bingung
                total_komentar: parseInt(commentCountResult.rows[0].total) || 0
            };
        }));

        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            status: "success",
            message: "Data postingan berhasil diambil",
            data: formattedData,
            total_items: totalItems,
            total_pages: totalPages,
            current_page: page
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ message: "ID harus angka" });

    try {
        const data = await Post.getById(id);
        if (!data.rows[0]) return res.status(404).json({ message: "Data tidak ditemukan" });
        
        const item = data.rows[0];

        // Ambil jumlah komentar untuk single view
        const commentCount = await pool.query("SELECT COUNT(*) as total FROM comments WHERE post_id = $1", [id]);
        
        if (item.gambar) item.gambar = `${baseUrl}/${item.gambar}`;
        item.total_komentar = parseInt(commentCount.rows[0].total) || 0;

        response.success(res, item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    if (!req.file || !req.file.minioPath) {
        return res.status(400).json({ message: "Gambar wajib diunggah" });
    }

    const { judul, isi, category_id } = req.body;
    const gambar = req.file.minioPath;

    try {
        const data = await Post.create(judul, isi, gambar, category_id);
        const result = data.rows[0];
        result.gambar = `${baseUrl}/${result.gambar}`;

        response.success(res, result, 'Post berhasil dibuat');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { judul, isi, category_id } = req.body;

    try {
        const oldPost = await Post.getById(id);
        if (!oldPost.rows[0]) return res.status(404).json({ message: "Post tidak ditemukan" });

        let gambar = oldPost.rows[0].gambar;
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

exports.addComment = async (req, res) => {
    try {
        const { postId, comment, rating } = req.body;
        // Gunakan req.user.email jika sudah lewat middleware auth
        const userEmail = req.user?.email || "anonymous@mail.com"; 

        const query = `
            INSERT INTO comments (post_id, email, comment, rating, created_at) 
            VALUES ($1, $2, $3, $4, NOW()) RETURNING *
        `;
        
        const newComment = await pool.query(query, [
            parseInt(postId), 
            userEmail, 
            comment, 
            parseInt(rating) || 5
        ]);

        res.status(201).json({
            status: "success",
            message: "Komentar berhasil dikirim!",
            data: newComment.rows[0]
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error Database: " + error.message });
    }
};

exports.getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const result = await pool.query(
            "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC", 
            [postId]
        );
        res.status(200).json({ status: "success", data: result.rows });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};