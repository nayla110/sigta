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

// Update Mahasiswa (Admin)
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

// ============================================
// MAHASISWA YANG LOGIN - PROFILE MANAGEMENT
// ============================================

// Get Current Mahasiswa Profile (yang sedang login)
exports.getCurrentProfile = async (req, res) => {
  try {
    const mahasiswaId = req.user.id; // Dari middleware auth

    const [mahasiswa] = await db.query(`
      SELECT m.id, m.nim, m.nama, m.email, m.no_telp, m.judul_ta,
             m.alamat, m.tanggal_lahir, m.jenis_kelamin, m.foto_profil,
             p.nama as program_studi_nama, p.kode as program_studi_kode, p.jenjang as program_studi_jenjang,
             d.nama as dosen_pembimbing_nama, d.nik as dosen_pembimbing_nik, 
             d.email as dosen_pembimbing_email, d.no_telp as dosen_pembimbing_telp
      FROM mahasiswa m
      LEFT JOIN program_studi p ON m.program_studi_id = p.id
      LEFT JOIN dosen d ON m.dosen_pembimbing_id = d.id
      WHERE m.id = ?
    `, [mahasiswaId]);

    if (mahasiswa.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Profil mahasiswa tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: mahasiswa[0]
    });
  } catch (error) {
    console.error('Error getting mahasiswa profile:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil profil mahasiswa'
    });
  }
};

// Update Profile Mahasiswa (Lengkap - dengan semua field)
exports.updateProfile = async (req, res) => {
  try {
    const mahasiswaId = req.user.id;
    const { 
      nama, 
      email, 
      no_telp, 
      alamat,
      tanggal_lahir,
      jenis_kelamin,
      judul_ta
    } = req.body;

    // Validasi input wajib
    if (!nama || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan Email wajib diisi'
      });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid'
      });
    }

    // Validasi nomor telepon (opsional, tapi jika diisi harus valid)
    if (no_telp) {
      const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
      if (!phoneRegex.test(no_telp.replace(/\s/g, ''))) {
        return res.status(400).json({
          success: false,
          message: 'Format nomor telepon tidak valid (contoh: 081234567890)'
        });
      }
    }

    // Validasi jenis kelamin
    if (jenis_kelamin && !['L', 'P'].includes(jenis_kelamin)) {
      return res.status(400).json({
        success: false,
        message: 'Jenis kelamin harus L (Laki-laki) atau P (Perempuan)'
      });
    }

    // Cek apakah mahasiswa ada
    const [existing] = await db.query(
      'SELECT * FROM mahasiswa WHERE id = ?',
      [mahasiswaId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mahasiswa tidak ditemukan'
      });
    }

    // Cek apakah email sudah digunakan oleh mahasiswa lain
    if (email !== existing[0].email) {
      const [duplicate] = await db.query(
        'SELECT * FROM mahasiswa WHERE email = ? AND id != ?',
        [email, mahasiswaId]
      );

      if (duplicate.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email sudah digunakan oleh mahasiswa lain'
        });
      }
    }

    // Update profile
    await db.query(
      `UPDATE mahasiswa 
       SET nama = ?, email = ?, no_telp = ?, alamat = ?,
           tanggal_lahir = ?, jenis_kelamin = ?, judul_ta = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [nama, email, no_telp || null, alamat || null, tanggal_lahir || null, jenis_kelamin || null, judul_ta || null, mahasiswaId]
    );

    // Ambil data yang sudah diupdate
    const [updated] = await db.query(
      `SELECT m.id, m.nim, m.nama, m.email, m.no_telp, m.alamat, 
              m.tanggal_lahir, m.jenis_kelamin, m.judul_ta, m.foto_profil,
              p.nama as program_studi_nama
       FROM mahasiswa m
       LEFT JOIN program_studi p ON m.program_studi_id = p.id
       WHERE m.id = ?`,
      [mahasiswaId]
    );

    res.json({
      success: true,
      message: 'Profil berhasil diupdate',
      data: updated[0]
    });
  } catch (error) {
    console.error('Error updating mahasiswa profile:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate profil'
    });
  }
};

// Update Password Mahasiswa
exports.updatePassword = async (req, res) => {
  try {
    const mahasiswaId = req.user.id;
    const { password_lama, password_baru, konfirmasi_password } = req.body;

    // Validasi input
    if (!password_lama || !password_baru || !konfirmasi_password) {
      return res.status(400).json({
        success: false,
        message: 'Semua field password harus diisi'
      });
    }

    if (password_baru !== konfirmasi_password) {
      return res.status(400).json({
        success: false,
        message: 'Password baru dan konfirmasi password tidak cocok'
      });
    }

    if (password_baru.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password baru minimal 6 karakter'
      });
    }

    // Ambil password lama dari database
    const [mahasiswa] = await db.query(
      'SELECT password FROM mahasiswa WHERE id = ?',
      [mahasiswaId]
    );

    if (mahasiswa.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mahasiswa tidak ditemukan'
      });
    }

    // Verifikasi password lama
    const isPasswordValid = await bcrypt.compare(password_lama, mahasiswa[0].password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Password lama tidak sesuai'
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(password_baru, 10);

    // Update password
    await db.query(
      'UPDATE mahasiswa SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, mahasiswaId]
    );

    res.json({
      success: true,
      message: 'Password berhasil diupdate'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate password'
    });
  }
};

// Upload Foto Profile
exports.uploadFotoProfile = async (req, res) => {
  try {
    const mahasiswaId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'File foto tidak ditemukan'
      });
    }

    // Path foto (sesuaikan dengan struktur folder upload Anda)
    const fotoUrl = `/uploads/profile/${file.filename}`;

    // Update foto_profil di database
    await db.query(
      'UPDATE mahasiswa SET foto_profil = ?, updated_at = NOW() WHERE id = ?',
      [fotoUrl, mahasiswaId]
    );

    res.json({
      success: true,
      message: 'Foto profil berhasil diupload',
      data: {
        foto_profil: fotoUrl
      }
    });
  } catch (error) {
    console.error('Error uploading foto profile:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupload foto profil'
    });
  }
};

// Get Dashboard Data (untuk mahasiswa yang login)
exports.getDashboardData = async (req, res) => {
  try {
    const mahasiswaId = req.user.id;

    // Get mahasiswa info dengan dosen pembimbing
    const [mahasiswa] = await db.query(`
      SELECT m.id, m.nim, m.nama, m.judul_ta,
             d.nama as dosen_nama, d.nik as dosen_nik, d.email as dosen_email, 
             d.no_telp as dosen_telp,
             p.nama as program_studi_nama
      FROM mahasiswa m
      LEFT JOIN dosen d ON m.dosen_pembimbing_id = d.id
      LEFT JOIN program_studi p ON m.program_studi_id = p.id
      WHERE m.id = ?
    `, [mahasiswaId]);

    if (mahasiswa.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data mahasiswa tidak ditemukan'
      });
    }

    // Get jadwal bimbingan mendatang
    const [jadwalBimbingan] = await db.query(`
      SELECT id, tanggal, topik, status, catatan
      FROM bimbingan
      WHERE mahasiswa_id = ? AND tanggal >= NOW()
      ORDER BY tanggal ASC
      LIMIT 5
    `, [mahasiswaId]);

    res.json({
      success: true,
      data: {
        mahasiswa: mahasiswa[0],
        jadwal_bimbingan: jadwalBimbingan
      }
    });
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data dashboard'
    });
  }
};