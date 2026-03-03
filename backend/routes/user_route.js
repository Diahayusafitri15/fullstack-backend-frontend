const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

// Pastikan memanggil handler yang benar
router.post('/login', userController.login);
router.post('/refresh-token', userController.refresh);

module.exports = router;