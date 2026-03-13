const express = require('express');
const router = express.Router();

// Import middleware untuk keamanan rute
const { verifyToken } = require('../middlewares/auth');

// Import controller
const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder
} = require('../controllers/order_controller'); 

/**
 * --- JALUR USER ---
 */

// POST: /api/orders/create
// Diubah dari '/' menjadi '/create' agar sesuai dengan panggila axios di frontend
router.post('/create', verifyToken, createOrder);

// GET: /api/orders/my-orders
router.get('/my-orders', verifyToken, getMyOrders);

/**
 * --- JALUR ADMIN ---
 */

// GET: /api/orders/all
router.get('/all', verifyToken, getAllOrders);

// PUT: /api/orders/1/status
router.put('/:id/status', verifyToken, updateOrderStatus);

// DELETE: /api/orders/1
router.delete('/:id', verifyToken, deleteOrder);

module.exports = router;