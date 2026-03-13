const express = require('express');
const router = express.Router();

// Middleware upload MinIO
const { upload, uploadToMinio } = require('../middlewares/upload_minio');
const { verifyToken } = require('../middlewares/auth');

// Controller
const {
    getAll,
    getById,
    create,
    update,
    remove,
    addComment,
    getCommentsByPost,
    getAllCommentsAdmin,
    deleteCommentAdmin
} = require('../controllers/post_controller');


/**
 * =========================
 * PUBLIC ROUTES
 * =========================
 */

// Ambil semua postingan
router.get('/', getAll);

// Ambil semua komentar (ADMIN)
router.get('/comments/all', verifyToken, getAllCommentsAdmin);

// Ambil komentar berdasarkan post
router.get('/comments/:postId', getCommentsByPost);

// Ambil detail post
router.get('/:id', getById);


/**
 * =========================
 * PROTECTED ROUTES (USER)
 * =========================
 */

// Tambah komentar
router.post('/comments', verifyToken, addComment);


/**
 * =========================
 * ADMIN ROUTES
 * =========================
 */

// CREATE POST
router.post(
    '/',
    verifyToken,
    upload.single('gambar'),
    uploadToMinio,
    create
);

// UPDATE POST
router.put(
    '/:id',
    verifyToken,
    upload.single('gambar'),
    uploadToMinio,
    update
);

// DELETE POST
router.delete('/:id', verifyToken, remove);

// DELETE COMMENT (ADMIN)
router.delete('/comments/:commentId', verifyToken, deleteCommentAdmin);


module.exports = router;