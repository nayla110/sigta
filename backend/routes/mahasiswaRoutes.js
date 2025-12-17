const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswaController');
const { authenticate } = require('../middleware/auth');

// Semua routes butuh authentication
router.use(authenticate);

// === ROUTES UNTUK MAHASISWA YANG LOGIN ===
// Get current mahasiswa profile
router.get('/profile', mahasiswaController.getCurrentProfile);

// Update own profile
router.put('/profile', mahasiswaController.updateOwnProfile);

// Get dashboard data
router.get('/dashboard', mahasiswaController.getDashboardData);

// === ROUTES UNTUK ADMIN (CRUD MAHASISWA) ===
// Get all mahasiswa
router.get('/', mahasiswaController.getAllMahasiswa);

// Get mahasiswa by ID
router.get('/:id', mahasiswaController.getMahasiswaById);

// Create mahasiswa
router.post('/', mahasiswaController.createMahasiswa);

// Update mahasiswa
router.put('/:id', mahasiswaController.updateMahasiswa);

// Delete mahasiswa
router.delete('/:id', mahasiswaController.deleteMahasiswa);

module.exports = router;