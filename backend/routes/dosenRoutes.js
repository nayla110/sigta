const express = require('express');
const router = express.Router();
const dosenController = require('../controllers/dosenController');
const { authenticate } = require('../middleware/auth');

// Semua routes butuh authentication
router.use(authenticate);

// Get all dosen
router.get('/', dosenController.getAllDosen);

// Get dosen by ID
router.get('/:id', dosenController.getDosenById);

// Create dosen
router.post('/', dosenController.createDosen);

// Update dosen
router.put('/:id', dosenController.updateDosen);

// Delete dosen
router.delete('/:id', dosenController.deleteDosen);

module.exports = router;