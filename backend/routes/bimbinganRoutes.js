const express = require('express');
const router = express.Router();
const bimbinganController = require('../controllers/bimbinganController');
const { authenticate } = require('../middleware/auth');

// Semua routes butuh authentication
router.use(authenticate);

// ============= ROUTES MAHASISWA =============
// Create pengajuan bimbingan
router.post('/mahasiswa/pengajuan', bimbinganController.createPengajuan);

// Get bimbingan mahasiswa
router.get('/mahasiswa/list', bimbinganController.getMahasiswaBimbingan);

// ============= ROUTES DOSEN =============
// Get pengajuan bimbingan (bisa filter by status)
router.get('/dosen/pengajuan', bimbinganController.getDosenPengajuan);

// Update status pengajuan (Terima/Tolak)
router.put('/dosen/pengajuan/:id/status', bimbinganController.updateStatusPengajuan);

// Update catatan bimbingan
router.put('/dosen/pengajuan/:id/catatan', bimbinganController.updateCatatanBimbingan);

// Tandai selesai
router.put('/dosen/pengajuan/:id/selesai', bimbinganController.tandaiSelesai);

module.exports = router;