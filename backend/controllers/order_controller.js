const pool = require('../config/db');

// ==============================
// FITUR USER
// ==============================

/**
 * Membuat pesanan baru (Checkout)
 */
const createOrder = async (req, res) => {
    try {
        const {
            post_id,
            qty,
            total_bayar,
            provinsi,
            kota,
            kecamatan,
            desa,
            kode_pos,
            alamat_lengkap
        } = req.body;

        // 1. Cek user dari middleware auth (Penting!)
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                status: "error",
                message: "Sesi Anda habis, silakan login kembali."
            });
        }

        const user_id = req.user.id;

        // 2. Validasi input (Wajib diisi)
        if (!post_id || !qty || !total_bayar || !alamat_lengkap) {
            return res.status(400).json({
                status: "error",
                message: "Data pesanan dan alamat pengiriman wajib dilengkapi."
            });
        }

        // 3. Konversi tipe data agar sesuai dengan database (Postgres strict type)
        const cleanPostId = parseInt(post_id);
        const cleanQty = parseInt(qty);
        const cleanTotal = parseFloat(total_bayar); // Gunakan Float untuk angka/desimal

        const query = `
            INSERT INTO orders 
            (user_id, post_id, qty, total_bayar, provinsi, kota, kecamatan, desa, kode_pos, alamat_lengkap, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;

        const values = [
            user_id,
            cleanPostId,
            cleanQty,
            cleanTotal,
            provinsi || null, // Jika opsional, beri null agar tidak error
            kota || null,
            kecamatan || null,
            desa || null,
            kode_pos || null,
            alamat_lengkap,
            'pending' // Status awal selalu pending
        ];

        const result = await pool.query(query, values);

        return res.status(201).json({
            status: "success",
            message: "Pesanan berhasil dibuat ✨",
            data: result.rows[0]
        });

    } catch (err) {
        console.error("Create Order Error:", err.message);
        return res.status(500).json({
            status: "error",
            message: "Gagal membuat pesanan: " + err.message
        });
    }
};

/**
 * Melihat riwayat pesanan milik user
 */
const getMyOrders = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                status: "error",
                message: "User tidak terautentikasi"
            });
        }

        const user_id = req.user.id;

        const query = `
            SELECT 
                o.*, 
                p.judul as nama_produk,
                p.gambar
            FROM orders o
            LEFT JOIN posts p ON o.post_id = p.id
            WHERE o.user_id = $1
            ORDER BY o.created_at DESC
        `;

        const result = await pool.query(query, [user_id]);

        return res.status(200).json({
            status: "success",
            total: result.rowCount,
            data: result.rows
        });

    } catch (err) {
        console.error("Get My Orders Error:", err);
        return res.status(500).json({
            status: "error",
            message: "Gagal mengambil data pesanan"
        });
    }
};

// ==============================
// FITUR ADMIN
// ==============================

/**
 * Melihat semua pesanan (Admin Only)
 */
const getAllOrders = async (req, res) => {
    try {
        const query = `
            SELECT 
                o.*,
                p.judul AS nama_produk,
                u.nama AS nama_pembeli,
                u.email AS email_pembeli
            FROM orders o
            LEFT JOIN posts p ON o.post_id = p.id
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `;

        const result = await pool.query(query);

        return res.status(200).json({
            status: "success",
            total: result.rowCount,
            data: result.rows
        });

    } catch (err) {
        console.error("Get All Orders Error:", err);
        return res.status(500).json({
            status: "error",
            message: "Gagal mengambil data semua pesanan"
        });
    }
};

/**
 * Update status pesanan (Admin Only)
 */
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'proses', 'dikirim', 'selesai', 'dibatalkan'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                status: "error",
                message: "Status tidak valid. Gunakan: " + validStatuses.join(', ')
            });
        }

        const result = await pool.query(
            `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: "error",
                message: "Pesanan tidak ditemukan"
            });
        }

        return res.status(200).json({
            status: "success",
            message: `Status pesanan #${id} berhasil diubah ke ${status}`,
            data: result.rows[0]
        });

    } catch (err) {
        console.error("Update Order Status Error:", err);
        return res.status(500).json({
            status: "error",
            message: "Gagal update status pesanan"
        });
    }
};

/**
 * Menghapus pesanan (Admin Only)
 */
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM orders WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: "error",
                message: "Data pesanan tidak ditemukan"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Pesanan berhasil dihapus dari sistem"
        });

    } catch (err) {
        console.error("Delete Order Error:", err);
        return res.status(500).json({
            status: "error",
            message: "Gagal menghapus data"
        });
    }
};

module.exports = { 
    createOrder, 
    getMyOrders, 
    getAllOrders, 
    updateOrderStatus, 
    deleteOrder 
};