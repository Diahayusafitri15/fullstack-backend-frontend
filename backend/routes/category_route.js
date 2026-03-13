const express = require('express');
const router = express.Router();

// Import middleware auth
const { verifyToken, isAdmin } = require('../middlewares/auth');

// Import controller kategori
const categoryController = require('../controllers/category_controller');


/**
 * ==============================
 * PUBLIC ROUTES (TIDAK PERLU LOGIN)
 * ==============================
 */

// Ambil semua kategori
router.get('/', categoryController.getAllCategories);

// Ambil kategori berdasarkan ID
router.get('/:id', categoryController.getCategoryById);


/**
 * ==============================
 * ADMIN ROUTES (WAJIB LOGIN + ADMIN)
 * ==============================
 */

// Tambah kategori
router.post('/', verifyToken, isAdmin, categoryController.createCategory);

// Update kategori
router.put('/:id', verifyToken, isAdmin, categoryController.updateCategory);

// Hapus kategori
router.delete('/:id', verifyToken, isAdmin, categoryController.deleteCategory);


module.exports = router;