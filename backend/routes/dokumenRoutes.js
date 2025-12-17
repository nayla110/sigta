// backend/routes/dokumenRoutes.js
const express = require('express');
const router = express.Router();
const dokumenController = require('../controllers/dokumenController');
const { authenticate } = require('../middleware/auth');

// Semua routes butuh authentication
router.use(authenticate);

// ============= DOSEN ROUTES =============
// Get mahasiswa bimbingan dengan detail
router.get('/dosen/mahasiswa', dokumenController.getMahasiswaBimbinganDetail);

// Get progress mahasiswa (status dan bab)
router.get('/dosen/mahasiswa/:mahasiswaId/progress', dokumenController.getProgressMahasiswa);

// Get riwayat dokumen mahasiswa
router.get('/dosen/mahasiswa/:mahasiswaId/riwayat', dokumenController.getRiwayatDokumen);

// Review dokumen (approve/reject)
router.put('/dosen/dokumen/:dokumenId/review', dokumenController.reviewDokumen);

// Update status progress mahasiswa (untuk edit status di modal)
router.put('/dosen/mahasiswa/:mahasiswaId/status', dokumenController.updateMahasiswaStatus);

// ============= MAHASISWA ROUTES =============
// Get progress mahasiswa sendiri (untuk validasi upload)
router.get('/mahasiswa/progress', dokumenController.getMahasiswaProgress);

// Upload dokumen
router.post('/mahasiswa/upload', dokumenController.uploadDokumen);

// Get dokumen mahasiswa sendiri
router.get('/mahasiswa/dokumen', dokumenController.getMahasiswaDokumen);

module.exports = router;