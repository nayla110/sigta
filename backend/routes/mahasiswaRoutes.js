const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswaController');
const { authenticate } = require('../middleware/auth');
const uploadProfile = require('../middleware/uploadProfile'); 

// ============================================
// ROUTES UNTUK MAHASISWA YANG LOGIN
// ============================================
// Semua routes di bawah ini butuh authentication
router.use(authenticate);

// Get current mahasiswa profile
router.get('/profile', mahasiswaController.getCurrentProfile);

// Update profile mahasiswa (LENGKAP - dengan semua field)
router.put('/profile', mahasiswaController.updateProfile);

// Update password mahasiswa
router.put('/update-password', mahasiswaController.updatePassword);

// Upload foto profile
router.post('/upload-foto', uploadProfile.single('foto'), mahasiswaController.uploadFotoProfile);

// Get dashboard data
router.get('/dashboard', mahasiswaController.getDashboardData);

// ============================================
// ROUTES UNTUK ADMIN (CRUD MAHASISWA)
// ============================================

// Get all mahasiswa
router.get('/', mahasiswaController.getAllMahasiswa);

// Get mahasiswa by ID
router.get('/:id', mahasiswaController.getMahasiswaById);

// Create mahasiswa
router.post('/', mahasiswaController.createMahasiswa);

// Update mahasiswa (admin)
router.put('/:id', mahasiswaController.updateMahasiswa);

// Delete mahasiswa
router.delete('/:id', mahasiswaController.deleteMahasiswa);

module.exports = router;