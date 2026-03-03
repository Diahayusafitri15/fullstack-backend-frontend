const express = require('express');
const router = express.Router();
const postController = require('../controllers/post_controller');
const auth = require('../middlewares/auth');
// Ambil middleware baru yang ada Sharp & MinIO-nya
const { upload, uploadToMinio } = require('../middlewares/upload_minio'); 
const { body } = require('express-validator');

const postValidation = [
    body('judul').notEmpty().withMessage('Judul wajib diisi').trim(),
    body('isi').notEmpty().withMessage('Isi wajib diisi').trim(),
    body('category_id').isNumeric().withMessage('Kategori harus berupa angka ID')
];

// 1. Ambil semua post (Publik)
router.get('/', postController.getAll);

// 2. Ambil satu post (Publik)
router.get('/:id', postController.getById);

// 3. Tambah Post Baru (Wajib Login + Resize + MinIO)
router.post('/', 
    auth,                       // 1. Cek Token JWT
    upload.single('gambar'),    // 2. Terima file ke RAM
    uploadToMinio,              // 3. Resize Sharp & Kirim ke MinIO
    postValidation,             // 4. Validasi Teks
    postController.create       // 5. Simpan URL ke Database
);

// 4. Update Post (Wajib Login + Resize + MinIO)
router.put('/:id', 
    auth, 
    upload.single('gambar'), 
    uploadToMinio,              // Tetap pasang ini agar jika ganti gambar, langsung masuk MinIO
    postValidation, 
    postController.update
);

// 5. Hapus Post (Wajib Login)
router.delete('/:id', auth, postController.remove);

module.exports = router;