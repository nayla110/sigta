const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Get All Dosen
exports.getAllDosen = async (req, res) => {
  try {
    const [dosen] = await db.query(`
      SELECT d.*, p.nama as program_studi_nama
      FROM dosen d
      LEFT JOIN program_studi p ON d.program_studi_id = p.id
      ORDER BY d.nama ASC
    `);

    res.json({
      success: true,
      data: dosen
    });
  } catch (error) {
    console.error('Error getting dosen:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data dosen'
    });
  }
};

// Get Dosen by ID
exports.getDosenById = async (req, res) => {
  try {
    const { id } = req.params;

    const [dosen] = await db.query(`
      SELECT d.*, p.nama as program_studi_nama
      FROM dosen d
      LEFT JOIN program_studi p ON d.program_studi_id = p.id
      WHERE d.id = ?
    `, [id]);

    if (dosen.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dosen tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: dosen[0]
    });
  } catch (error) {
    console.error('Error getting dosen by id:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data dosen'
    });
  }
};

// Create Dosen
exports.createDosen = async (req, res) => {
  try {
    const { nik, nama, email, password, no_telp, program_studi_id } = req.body;

    // Validasi input
    if (!nik || !nama || !email || !password || !program_studi_id) {
      return res.status(400).json({
        success: false,
        message: 'NIK, Nama, Email, Password, dan Program Studi wajib diisi'
      });
    }

    // Cek apakah NIK atau Email sudah ada
    const [existing] = await db.query(
      'SELECT * FROM dosen WHERE nik = ? OR email = ?',
      [nik, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'NIK atau Email sudah terdaftar'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate ID
    const dosenId = `dosen_${Date.now()}`;

    // Insert dosen
    await db.query(
      `INSERT INTO dosen (id, nik, nama, email, password, no_telp, program_studi_id, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [dosenId, nik, nama, email, hashedPassword, no_telp, program_studi_id]
    );

    res.status(201).json({
      success: true,
      message: 'Dosen berhasil ditambahkan',
      data: { id: dosenId }
    });
  } catch (error) {
    console.error('Error creating dosen:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan dosen'
    });
  }
};

// Update Dosen
exports.updateDosen = async (req, res) => {
  try {
    const { id } = req.params;
    const { nik, nama, email, password, no_telp, program_studi_id } = req.body;

    // Cek apakah dosen ada
    const [existing] = await db.query(
      'SELECT * FROM dosen WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dosen tidak ditemukan'
      });
    }

    // Cek apakah NIK atau Email sudah digunakan oleh dosen lain
    const [duplicate] = await db.query(
      'SELECT * FROM dosen WHERE (nik = ? OR email = ?) AND id != ?',
      [nik, email, id]
    );

    if (duplicate.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'NIK atau Email sudah digunakan oleh dosen lain'
      });
    }

    // Prepare update query
    let updateQuery = `
      UPDATE dosen 
      SET nik = ?, nama = ?, email = ?, no_telp = ?, program_studi_id = ?, updated_at = NOW()
    `;
    let updateParams = [nik, nama, email, no_telp, program_studi_id];

    // Jika password diisi, update juga
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += `, password = ?`;
      updateParams.push(hashedPassword);
    }

    updateQuery += ` WHERE id = ?`;
    updateParams.push(id);

    await db.query(updateQuery, updateParams);

    res.json({
      success: true,
      message: 'Dosen berhasil diupdate'
    });
  } catch (error) {
    console.error('Error updating dosen:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate dosen'
    });
  }
};

// Delete Dosen
exports.deleteDosen = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah dosen ada
    const [existing] = await db.query(
      'SELECT * FROM dosen WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dosen tidak ditemukan'
      });
    }

    // Cek apakah dosen masih membimbing mahasiswa
    const [mahasiswa] = await db.query(
      'SELECT COUNT(*) as total FROM mahasiswa WHERE dosen_pembimbing_id = ?',
      [id]
    );

    if (mahasiswa[0].total > 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus dosen yang masih membimbing mahasiswa'
      });
    }

    // Delete dosen
    await db.query('DELETE FROM dosen WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Dosen berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting dosen:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus dosen'
    });
  }
};