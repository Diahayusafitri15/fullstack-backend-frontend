const Post = require('../models/post');
const response = require('../utils/response');
const { validationResult } = require('express-validator');
const pool = require('../config/db');

/**
 * KONFIGURASI BASE URL
 * Menggunakan IP 192.168.18.67 sesuai terminal MinIO kamu agar tidak ERR_CONNECTION_REFUSED.
 */
const minioAddr = process.env.MINIO_ENDPOINT || '192.168.18.67';
const minioPort = process.env.MINIO_PORT || 9000;
const baseUrl = process.env.MINIO_BASE_URL || `http://${minioAddr}:${minioPort}`;

// Helper untuk membersihkan input dari string "undefined", null, atau kosong
const cleanInput = (val, fallback) => {
    if (val === undefined || val === null || val === "undefined" || val === "") {
        return fallback;
    }
    return val;
};

/**
 * Helper untuk membersihkan path gambar dari kutip ganda 
 * dan menambahkan timestamp agar browser tidak menyimpan cache gambar lama.
 */
const formatGambarUrl = (path) => {
    if (!path) return null;
    const cleanPath = path.toString().replace(/"/g, "");
    return `${baseUrl}/${cleanPath}?t=${Date.now()}`;
};

// =======================
// GET ALL POSTS
// =======================
const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const search = req.query.search || "";

        const { rows, totalItems } = await Post.getAll(page, limit, search);

        const formattedData = await Promise.all(
            rows.map(async (item) => {
                const commentCount = await pool.query(
                    "SELECT COUNT(*) as total FROM comments WHERE post_id = $1",
                    [item.id]
                );

                return {
                    ...item,
                    gambar: formatGambarUrl(item.gambar),
                    total_komentar: parseInt(commentCount.rows[0].total) || 0
                };
            })
        );

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

// =======================
// GET POST BY ID
// =======================
const getById = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).json({ message: "ID harus angka" });
    }

    try {
        const data = await Post.getById(id);
        const postData = data.rows ? data.rows[0] : data;
        
        if (!postData) {
            return res.status(404).json({ message: "Data tidak ditemukan" });
        }

        const commentCount = await pool.query(
            "SELECT COUNT(*) as total FROM comments WHERE post_id = $1",
            [id]
        );

        postData.gambar_raw = postData.gambar;
        postData.gambar = formatGambarUrl(postData.gambar);
        postData.total_komentar = parseInt(commentCount.rows[0].total) || 0;
        
        response.success(res, postData);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =======================
// CREATE POST
// =======================
const create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { judul, isi, harga, category_id } = req.body;

        const gambar = req.file ? (req.file.minioPath || req.file.filename) : null;

        if (!gambar) {
            return res.status(400).json({ message: "Gambar wajib diunggah" });
        }

        const result = await Post.create(judul, isi, harga, gambar, category_id);
        const newData = result.rows ? result.rows[0] : result;

        if (newData.gambar) {
            newData.gambar = formatGambarUrl(newData.gambar);
        }

        res.status(201).json({
            status: "success",
            message: "Souvenir baru berhasil ditambahkan! 🌸",
            data: newData
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =======================
// UPDATE POST
// =======================
const update = async (req, res) => {
    const { id } = req.params;

    try {
        const oldPostResult = await Post.getById(id);
        const oldData = oldPostResult.rows ? oldPostResult.rows[0] : oldPostResult;

        if (!oldData) {
            return res.status(404).json({ status: "error", message: "Post tidak ditemukan" });
        }

        const judul = cleanInput(req.body.judul, oldData.judul);
        const isi = cleanInput(req.body.isi, oldData.isi);
        const category_id = parseInt(cleanInput(req.query.category_id || req.body.category_id, oldData.category_id));
        const harga = parseInt(cleanInput(req.body.harga, oldData.harga));

        let gambar = oldData.gambar;

        if (req.file) {
            gambar = req.file.minioPath || req.file.filename;
        }

        const result = await Post.update(id, judul, isi, harga, gambar, category_id);
        const updatedData = result.rows ? result.rows[0] : result;

        if (updatedData && updatedData.gambar) {
            updatedData.gambar = formatGambarUrl(updatedData.gambar);
        }

        return res.status(200).json({
            status: "success",
            message: "Post SOUVNELA berhasil diperbarui! ✨",
            data: updatedData
        });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({
            status: "error",
            message: "Gagal Update: " + error.message
        });
    }
};

// =======================
// DELETE POST
// =======================
const remove = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.getById(id);

        if (!post) {
            return res.status(404).json({ message: "Post tidak ditemukan" });
        }

        await Post.remove(id);

        response.success(res, null, "Post berhasil dihapus");

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =======================
// TAMBAH KOMENTAR
// =======================
const addComment = async (req, res) => {
    try {
        const { postId, comment, rating } = req.body;
        const userEmail = req.user?.email;

        if (!userEmail) {
            return res.status(401).json({
                status: "error",
                message: "Login dulu"
            });
        }

        const query = `
            INSERT INTO comments (post_id, email, comment, rating, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *
        `;

        const newComment = await pool.query(query, [
            parseInt(postId),
            userEmail,
            comment,
            parseInt(rating) || 5
        ]);

        res.status(201).json({
            status: "success",
            data: newComment.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// =======================
// GET KOMENTAR PER POST
// =======================
const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const result = await pool.query(
            "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC",
            [postId]
        );

        res.status(200).json({
            status: "success",
            data: result.rows
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// =======================
// ADMIN - GET SEMUA KOMENTAR
// =======================
const getAllCommentsAdmin = async (req, res) => {
    try {
        const query = `
            SELECT c.*, p.judul as nama_produk
            FROM comments c
            JOIN posts p ON c.post_id = p.id
            ORDER BY c.created_at DESC
        `;

        const result = await pool.query(query);

        res.status(200).json({
            status: "success",
            data: result.rows
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// =======================
// ADMIN - DELETE KOMENTAR
// =======================
const removeComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        await pool.query(
            "DELETE FROM comments WHERE id = $1",
            [commentId]
        );

        res.status(200).json({
            status: "success",
            message: "Komentar dihapus"
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    addComment,
    getCommentsByPost,
    getAllCommentsAdmin,
    deleteCommentAdmin: removeComment
};