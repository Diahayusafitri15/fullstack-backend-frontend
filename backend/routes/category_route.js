const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category_controller');
const auth = require('../middlewares/auth');
const { body } = require('express-validator');

// 1. Ambil semua kategori (Publik)
router.get('/', categoryController.getAll);

// 2. Ambil kategori berdasarkan ID (Publik) - BARU
router.get('/:id', categoryController.getById);

// 3. Tambah kategori baru (Wajib Login)
router.post('/', 
    auth, 
    [body('nama_kategori').notEmpty().withMessage('Nama kategori wajib diisi')], 
    categoryController.create
);

// 4. Update kategori (Wajib Login) - BARU
router.put('/:id', 
    auth, 
    [body('nama_kategori').notEmpty().withMessage('Nama kategori wajib diisi')], 
    categoryController.update
);

// 5. Hapus kategori (Wajib Login)
router.delete('/:id', auth, categoryController.remove);

module.exports = router;