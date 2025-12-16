const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.post('/login', adminController.login);

// Protected routes (butuh authentication)
router.use(authenticate); // Semua route di bawah ini perlu token

router.get('/dashboard', adminController.getDashboardStats);
router.get('/profile', adminController.getProfile);
router.post('/logout', adminController.logout);

module.exports = router;