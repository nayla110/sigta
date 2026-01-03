const express = require('express');
const router = express.Router();
const dosenController = require('../controllers/dosenController');
const { authenticate } = require('../middleware/auth');
const uploadProfile = require('../middleware/uploadProfile'); 

// Semua routes butuh authentication
router.use(authenticate);

// === ROUTES UNTUK DOSEN YANG LOGIN ===
// ⚠️ PENTING: Route /profile harus di atas route /:id
router.get('/profile', dosenController.getCurrentProfile);
router.put('/profile', dosenController.updateProfile); // ✅ Gunakan /profile bukan /update-profile
router.put('/update-password', dosenController.updatePassword);
router.post('/upload-foto', uploadProfile.single('foto'), dosenController.uploadFotoProfile);

// Get mahasiswa bimbingan
router.get('/mahasiswa-bimbingan', dosenController.getMahasiswaBimbingan);

// === ROUTES UNTUK ADMIN (CRUD DOSEN) ===
// Get all dosen
router.get('/', dosenController.getAllDosen);

// Get dosen by ID (harus di bawah route /profile)
router.get('/:id', dosenController.getDosenById);

// Create dosen
router.post('/', dosenController.createDosen);

// Update dosen
router.put('/:id', dosenController.updateDosen);

// Delete dosen
router.delete('/:id', dosenController.deleteDosen);

module.exports = router;