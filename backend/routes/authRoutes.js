const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Public routes - Login
router.post('/mahasiswa/login', authController.loginMahasiswa);
router.post('/dosen/login', authController.loginDosen);

// Protected routes - Profile & Logout
router.post('/logout', authenticate, authController.logout);
router.get('/mahasiswa/profile', authenticate, authController.getMahasiswaProfile);
router.get('/dosen/profile', authenticate, authController.getDosenProfile);

module.exports = router;