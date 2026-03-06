const express = require('express');
const router = express.Router();
const postController = require('../controllers/post_controller');
const userController = require('../controllers/user_controller'); // Import controller user untuk fitur komentar
const auth = require('../middlewares/auth');
const { upload, uploadToMinio } = require('../middlewares/upload_minio'); 
const { body } = require('express-validator');

const postValidation = [
    body('judul').notEmpty().withMessage('Judul wajib diisi').trim(),
    body('isi').notEmpty().withMessage('Isi wajib diisi').trim(),
    body('category_id').isNumeric().withMessage('Kategori harus berupa angka ID')
];

// --- ROUTES POSTINGAN (SUDAH ADA) ---
router.get('/', postController.getAll);
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

// --- ROUTES KOMENTAR & RATING (TAMBAHAN BARU) ---

// 1. Ambil semua komentar untuk postingan tertentu (Publik)
router.get('/:postId/comments', userController.getCommentsByPost);

// 2. Tambah Komentar & Rating (Wajib Login)
// Kita pakai middleware 'auth' agar email pengirim otomatis tercatat
router.post('/comments', auth, userController.addComment);

// 3. Hapus Komentar (Wajib Login & Khusus Admin)
router.delete('/comments/:id', auth, userController.deleteComment);

module.exports = router;