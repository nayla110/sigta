const express = require('express');
const router = express.Router();
const beritaController = require('../controllers/beritaController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.get('/published', beritaController.getPublishedBerita);

// Protected routes (butuh authentication)
router.use(authenticate);

router.get('/', beritaController.getAllBerita);
router.get('/:id', beritaController.getBeritaById);
router.post('/', beritaController.createBerita);
router.put('/:id', beritaController.updateBerita);
router.delete('/:id', beritaController.deleteBerita);

module.exports = router;