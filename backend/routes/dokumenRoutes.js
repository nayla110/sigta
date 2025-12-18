// backend/routes/dokumenRoutes.js
const express = require('express');
const router = express.Router();
const dokumenController = require('../controllers/dokumenController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

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

// ⭐ TAMBAHAN BARU: Download dan View Dokumen
router.get('/dosen/dokumen/:dokumenId/download', dokumenController.downloadDokumen);
router.get('/dosen/dokumen/:dokumenId/view', dokumenController.viewDokumen);

// ============= MAHASISWA ROUTES =============
// Get progress mahasiswa sendiri (untuk validasi upload)
router.get('/mahasiswa/progress', dokumenController.getMahasiswaProgress);

// ⭐ UPDATE: Upload dokumen dengan multer
router.post('/mahasiswa/upload', upload.single('file'), dokumenController.uploadDokumen);

// Get dokumen mahasiswa sendiri
router.get('/mahasiswa/dokumen', dokumenController.getMahasiswaDokumen);

module.exports = router;