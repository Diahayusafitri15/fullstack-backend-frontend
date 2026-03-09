const express = require('express');
const router = express.Router();
const postController = require('../controllers/post_controller');
const userController = require('../controllers/user_controller'); 
const auth = require('../middlewares/auth'); // Middleware JWT kamu
const { upload, uploadToMinio } = require('../middlewares/upload_minio'); 
const { body } = require('express-validator');

// Validasi input untuk postingan baru
const postValidation = [
    body('judul').notEmpty().withMessage('Judul wajib diisi').trim(),
    body('isi').notEmpty().withMessage('Isi wajib diisi').trim(),
    body('category_id').isNumeric().withMessage('Kategori harus berupa angka ID')
];

// ==========================================
// --- ROUTES KOMENTAR & MODERASI ---
// ==========================================

/** * PENTING: Route statis harus di atas route dinamis (/:id) 
 * agar tidak tertukar oleh Express.
 */

// 1. Ambil SEMUA komentar (Untuk Dashboard Admin)
// Endpoint: GET /posts/comments/all
router.get('/comments/all', auth, userController.getAllComments);

// 2. Tambah Komentar & Rating (Wajib Login)
// Endpoint: POST /posts/comments
router.post('/comments', auth, userController.addComment);

// 3. Hapus Komentar (Wajib Login - Admin atau Pemilik)
// Endpoint: DELETE /posts/comments/:id
router.delete('/comments/:id', auth, userController.deleteComment);

// 4. Ambil komentar per postingan tertentu
// Endpoint: GET /posts/:postId/comments
router.get('/:postId/comments', userController.getCommentsByPost);


// ==========================================
// --- ROUTES POSTINGAN (UTAMA) ---
// ==========================================

router.get('/', postController.getAll);

// Route dinamis /:id diletakkan di bawah agar tidak bentrok dengan /comments
router.get('/:id', postController.getById);

router.post('/', 
    auth, 
    upload.single('gambar'), 
    uploadToMinio, 
    postValidation, 
    postController.create 
);

router.put('/:id', 
    auth, 
    upload.single('gambar'), 
    uploadToMinio, 
    postValidation, 
    postController.update
);

router.delete('/:id', auth, postController.remove);

module.exports = router;