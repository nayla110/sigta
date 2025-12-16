const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Get All Mahasiswa
exports.getAllMahasiswa = async (req, res) => {
  try {
    const [mahasiswa] = await db.query(`
      SELECT m.*, 
             p.nama as program_studi_nama,
             d.nama as dosen_pembimbing_nama
      FROM mahasiswa m
      LEFT JOIN program_studi p ON m.program_studi_id = p.id
      LEFT JOIN dosen d ON m.dosen_pembimbing_id = d.id
      ORDER BY m.nama ASC
    `);

    res.json({
      success: true,
      data: mahasiswa
    });
  } catch (error) {
    console.error('Error getting mahasiswa:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data mahasiswa'
    });
  }
};

// Get Mahasiswa by ID
exports.getMahasiswaById = async (req, res) => {
  try {
    const { id } = req.params;

    const [mahasiswa] = await db.query(`
      SELECT m.*, 
             p.nama as program_studi_nama,
             d.nama as dosen_pembimbing_nama
      FROM mahasiswa m
      LEFT JOIN program_studi p ON m.program_studi_id = p.id
      LEFT JOIN dosen d ON m.dosen_pembimbing_id = d.id
      WHERE m.id = ?
    `, [id]);

    if (mahasiswa.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mahasiswa tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: mahasiswa[0]
    });
  } catch (error) {
    console.error('Error getting mahasiswa by id:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data mahasiswa'
    });
  }
};

// Create Mahasiswa
exports.createMahasiswa = async (req, res) => {
  try {
    const { 
      nim, 
      nama, 
      email, 
      password, 
      no_telp, 
      program_studi_id, 
      dosen_pembimbing_id,
      judul_ta 
    } = req.body;

    // Validasi input
    if (!nim || !nama || !email || !password || !program_studi_id) {
      return res.status(400).json({
        success: false,
        message: 'NIM, Nama, Email, Password, dan Program Studi wajib diisi'
      });
    }

    // Cek apakah NIM atau Email sudah ada
    const [existing] = await db.query(
      'SELECT * FROM mahasiswa WHERE nim = ? OR email = ?',
      [nim, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'NIM atau Email sudah terdaftar'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate ID
    const mahasiswaId = `mhs_${Date.now()}`;

    // Insert mahasiswa
    await db.query(
      `INSERT INTO mahasiswa (id, nim, nama, email, password, no_telp, program_studi_id, dosen_pembimbing_id, judul_ta, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [mahasiswaId, nim, nama, email, hashedPassword, no_telp, program_studi_id, dosen_pembimbing_id, judul_ta]
    );

    res.status(201).json({
      success: true,
      message: 'Mahasiswa berhasil ditambahkan',
      data: { id: mahasiswaId }
    });
  } catch (error) {
    console.error('Error creating mahasiswa:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan mahasiswa'
    });
  }
};

// Update Mahasiswa
exports.updateMahasiswa = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nim, 
      nama, 
      email, 
      password, 
      no_telp, 
      program_studi_id, 
      dosen_pembimbing_id,
      judul_ta 
    } = req.body;

    // Cek apakah mahasiswa ada
    const [existing] = await db.query(
      'SELECT * FROM mahasiswa WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mahasiswa tidak ditemukan'
      });
    }

    // Cek apakah NIM atau Email sudah digunakan oleh mahasiswa lain
    const [duplicate] = await db.query(
      'SELECT * FROM mahasiswa WHERE (nim = ? OR email = ?) AND id != ?',
      [nim, email, id]
    );

    if (duplicate.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'NIM atau Email sudah digunakan oleh mahasiswa lain'
      });
    }

    // Prepare update query
    let updateQuery = `
      UPDATE mahasiswa 
      SET nim = ?, nama = ?, email = ?, no_telp = ?, program_studi_id = ?, dosen_pembimbing_id = ?, judul_ta = ?, updated_at = NOW()
    `;
    let updateParams = [nim, nama, email, no_telp, program_studi_id, dosen_pembimbing_id, judul_ta];

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
      message: 'Mahasiswa berhasil diupdate'
    });
  } catch (error) {
    console.error('Error updating mahasiswa:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate mahasiswa'
    });
  }
};

// Delete Mahasiswa
exports.deleteMahasiswa = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah mahasiswa ada
    const [existing] = await db.query(
      'SELECT * FROM mahasiswa WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mahasiswa tidak ditemukan'
      });
    }

    // Delete mahasiswa (cascade akan handle related records)
    await db.query('DELETE FROM mahasiswa WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Mahasiswa berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting mahasiswa:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus mahasiswa'
    });
  }
};