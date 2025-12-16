const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswaController');
const { authenticate } = require('../middleware/auth');

// Semua routes butuh authentication
router.use(authenticate);

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