const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get All Program Studi (public atau authenticated)
router.get('/', async (req, res) => {
  try {
    const [programStudi] = await db.query(
      'SELECT * FROM program_studi ORDER BY nama ASC'
    );

    res.json({
      success: true,
      data: programStudi
    });
  } catch (error) {
    console.error('Error getting program studi:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data program studi'
    });
  }
});

module.exports = router;