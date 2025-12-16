const db = require('../config/database');

// Get All Berita
exports.getAllBerita = async (req, res) => {
  try {
    const [berita] = await db.query(`
      SELECT b.*, a.nama as admin_nama
      FROM berita b
      LEFT JOIN admin a ON b.admin_id = a.id
      ORDER BY b.created_at DESC
    `);

    res.json({
      success: true,
      data: berita
    });
  } catch (error) {
    console.error('Error getting berita:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data berita'
    });
  }
};

// Get Berita by ID
exports.getBeritaById = async (req, res) => {
  try {
    const { id } = req.params;

    const [berita] = await db.query(`
      SELECT b.*, a.nama as admin_nama
      FROM berita b
      LEFT JOIN admin a ON b.admin_id = a.id
      WHERE b.id = ?
    `, [id]);

    if (berita.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Berita tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: berita[0]
    });
  } catch (error) {
    console.error('Error getting berita by id:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data berita'
    });
  }
};

// Create Berita
exports.createBerita = async (req, res) => {
  try {
    const { judul, konten, status } = req.body;
    const adminId = req.user.id; // Dari middleware auth

    // Validasi input
    if (!judul || !konten) {
      return res.status(400).json({
        success: false,
        message: 'Judul dan Konten wajib diisi'
      });
    }

    // Generate ID
    const beritaId = `berita_${Date.now()}`;

    // Insert berita
    await db.query(
      `INSERT INTO berita (id, admin_id, judul, konten, status, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [beritaId, adminId, judul, konten, status || 'Draft']
    );

    res.status(201).json({
      success: true,
      message: 'Berita berhasil ditambahkan',
      data: { id: beritaId }
    });
  } catch (error) {
    console.error('Error creating berita:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan berita'
    });
  }
};

// Update Berita
exports.updateBerita = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, konten, status } = req.body;

    // Cek apakah berita ada
    const [existing] = await db.query(
      'SELECT * FROM berita WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Berita tidak ditemukan'
      });
    }

    // Update berita
    await db.query(
      `UPDATE berita 
       SET judul = ?, konten = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [judul, konten, status || 'Draft', id]
    );

    res.json({
      success: true,
      message: 'Berita berhasil diupdate'
    });
  } catch (error) {
    console.error('Error updating berita:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate berita'
    });
  }
};

// Delete Berita
exports.deleteBerita = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah berita ada
    const [existing] = await db.query(
      'SELECT * FROM berita WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Berita tidak ditemukan'
      });
    }

    // Delete berita
    await db.query('DELETE FROM berita WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Berita berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting berita:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus berita'
    });
  }
};

// Get Published Berita (untuk public)
exports.getPublishedBerita = async (req, res) => {
  try {
    const [berita] = await db.query(`
      SELECT b.id, b.judul, b.konten, b.tanggal, a.nama as admin_nama
      FROM berita b
      LEFT JOIN admin a ON b.admin_id = a.id
      WHERE b.status = 'Published'
      ORDER BY b.tanggal DESC
    `);

    res.json({
      success: true,
      data: berita
    });
  } catch (error) {
    console.error('Error getting published berita:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil berita'
    });
  }
};