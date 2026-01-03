const db = require('../config/database');
const bcrypt = require('bcryptjs');

// ============================================
// HELPER FUNCTION - Check Column Exists
// ============================================
let availableColumns = null;

async function checkAvailableColumns() {
  if (availableColumns !== null) return availableColumns;
  
  try {
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'dosen'
    `);
    
    availableColumns = columns.map(col => col.COLUMN_NAME);
    console.log('✅ Available columns in dosen table:', availableColumns);
    return availableColumns;
  } catch (error) {
    console.error('Error checking columns:', error);
    return ['id', 'nik', 'nama', 'email', 'password', 'no_telp', 'program_studi_id'];
  }
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

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

    if (!nik || !nama || !email || !password || !program_studi_id) {
      return res.status(400).json({
        success: false,
        message: 'NIK, Nama, Email, Password, dan Program Studi wajib diisi'
      });
    }

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const dosenId = `dosen_${Date.now()}`;

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

    let updateQuery = `
      UPDATE dosen 
      SET nik = ?, nama = ?, email = ?, no_telp = ?, program_studi_id = ?, updated_at = NOW()
    `;
    let updateParams = [nik, nama, email, no_telp, program_studi_id];

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

// ============================================
// DOSEN PROFILE FUNCTIONS - SAFE VERSION
// ============================================

// Get Current Dosen Profile (SAFE - Handle Missing Columns)
exports.getCurrentProfile = async (req, res) => {
  try {
    console.log('========================================');
    console.log('🔍 getCurrentProfile - SAFE VERSION');
    console.log('========================================');
    
    if (!req.user || !req.user.id) {
      console.error('❌ ERROR: req.user tidak ada');
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi. Silakan login kembali.'
      });
    }

    const dosenId = req.user.id;
    console.log('✅ User ID:', dosenId);

    // Check available columns
    const columns = await checkAvailableColumns();
    console.log('📋 Available columns:', columns);

    // Build query only for available columns
    const optionalColumns = [];
    if (columns.includes('alamat')) optionalColumns.push('d.alamat');
    if (columns.includes('tanggal_lahir')) optionalColumns.push('d.tanggal_lahir');
    if (columns.includes('jenis_kelamin')) optionalColumns.push('d.jenis_kelamin');
    if (columns.includes('pendidikan_terakhir')) optionalColumns.push('d.pendidikan_terakhir');
    if (columns.includes('bidang_keahlian')) optionalColumns.push('d.bidang_keahlian');
    if (columns.includes('foto_profil')) optionalColumns.push('d.foto_profil');

    const selectColumns = [
      'd.id',
      'd.nik', 
      'd.nama', 
      'd.email', 
      'd.no_telp',
      'd.program_studi_id',
      ...optionalColumns,
      'p.nama as program_studi_nama',
      'p.jenjang as program_studi_jenjang'
    ].join(', ');

    const query = `
      SELECT ${selectColumns}
      FROM dosen d
      LEFT JOIN program_studi p ON d.program_studi_id = p.id
      WHERE d.id = ?
    `;

    console.log('📊 Executing query...');
    const [dosen] = await db.query(query, [dosenId]);

    if (dosen.length === 0) {
      console.error('❌ Dosen tidak ditemukan');
      return res.status(404).json({
        success: false,
        message: 'Profil dosen tidak ditemukan'
      });
    }

    console.log('✅ Dosen found:', dosen[0].nama);

    const dosenData = dosen[0];

    // Parse bidang_keahlian if exists
    if (dosenData.bidang_keahlian) {
      if (typeof dosenData.bidang_keahlian === 'string') {
        try {
          dosenData.bidang_keahlian = JSON.parse(dosenData.bidang_keahlian);
        } catch (e) {
          dosenData.bidang_keahlian = [];
        }
      }
    } else {
      dosenData.bidang_keahlian = [];
    }

    // Count mahasiswa
    const [mahasiswaCount] = await db.query(
      'SELECT COUNT(*) as total FROM mahasiswa WHERE dosen_pembimbing_id = ?',
      [dosenId]
    );

    // Build safe response with defaults
    const responseData = {
      id: dosenData.id,
      nik: dosenData.nik,
      nama: dosenData.nama,
      email: dosenData.email,
      no_telp: dosenData.no_telp || '',
      alamat: dosenData.alamat || '',
      tanggal_lahir: dosenData.tanggal_lahir || null,
      jenis_kelamin: dosenData.jenis_kelamin || '',
      pendidikan_terakhir: dosenData.pendidikan_terakhir || '',
      bidang_keahlian: dosenData.bidang_keahlian,
      foto_profil: dosenData.foto_profil || null,
      program_studi_nama: dosenData.program_studi_nama || '-',
      program_studi_jenjang: dosenData.program_studi_jenjang || '-',
      total_mahasiswa_bimbingan: mahasiswaCount[0].total
    };

    console.log('✅ SUCCESS - Profile fetched');
    console.log('========================================');

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('========================================');
    console.error('❌ FATAL ERROR:');
    console.error('Message:', error.message);
    console.error('SQL:', error.sql);
    console.error('Stack:', error.stack);
    console.error('========================================');
    
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil profil dosen',
      error: error.message
    });
  }
};

// Get Mahasiswa Bimbingan
exports.getMahasiswaBimbingan = async (req, res) => {
  try {
    const dosenId = req.user.id;

    const [mahasiswa] = await db.query(`
      SELECT m.id, m.nim, m.nama, m.email, m.no_telp, m.judul_ta,
             p.nama as program_studi_nama, p.kode as program_studi_kode
      FROM mahasiswa m
      LEFT JOIN program_studi p ON m.program_studi_id = p.id
      WHERE m.dosen_pembimbing_id = ?
      ORDER BY m.nama ASC
    `, [dosenId]);

    res.json({
      success: true,
      data: mahasiswa
    });
  } catch (error) {
    console.error('Error getting mahasiswa bimbingan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data mahasiswa bimbingan'
    });
  }
};

// Update Profile Dosen (SAFE - Handle Missing Columns)
exports.updateProfile = async (req, res) => {
  try {
    const dosenId = req.user.id;
    const { 
      nama, 
      email, 
      no_telp,
      alamat,
      tanggal_lahir,
      jenis_kelamin,
      pendidikan_terakhir,
      bidang_keahlian
    } = req.body;

    if (!nama || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan Email wajib diisi'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid'
      });
    }

    if (no_telp) {
      const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
      if (!phoneRegex.test(no_telp.replace(/\s/g, ''))) {
        return res.status(400).json({
          success: false,
          message: 'Format nomor telepon tidak valid'
        });
      }
    }

    const [existing] = await db.query(
      'SELECT * FROM dosen WHERE id = ?',
      [dosenId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dosen tidak ditemukan'
      });
    }

    if (email !== existing[0].email) {
      const [duplicate] = await db.query(
        'SELECT * FROM dosen WHERE email = ? AND id != ?',
        [email, dosenId]
      );

      if (duplicate.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email sudah digunakan oleh dosen lain'
        });
      }
    }

    // Check available columns
    const columns = await checkAvailableColumns();

    // Build UPDATE query only for available columns
    const updates = ['nama = ?', 'email = ?', 'no_telp = ?', 'updated_at = NOW()'];
    const params = [nama, email, no_telp || null];

    if (columns.includes('alamat')) {
      updates.push('alamat = ?');
      params.push(alamat || null);
    }

    if (columns.includes('tanggal_lahir')) {
      updates.push('tanggal_lahir = ?');
      params.push(tanggal_lahir || null);
    }

    if (columns.includes('jenis_kelamin')) {
      updates.push('jenis_kelamin = ?');
      params.push(jenis_kelamin || null);
    }

    if (columns.includes('pendidikan_terakhir')) {
      updates.push('pendidikan_terakhir = ?');
      params.push(pendidikan_terakhir || null);
    }

    if (columns.includes('bidang_keahlian')) {
      const bidangKeahlianStr = Array.isArray(bidang_keahlian) 
        ? JSON.stringify(bidang_keahlian) 
        : bidang_keahlian;
      updates.push('bidang_keahlian = ?');
      params.push(bidangKeahlianStr);
    }

    params.push(dosenId);

    const updateQuery = `UPDATE dosen SET ${updates.join(', ')} WHERE id = ?`;

    await db.query(updateQuery, params);

    // Fetch updated profile
    const profile = await this.getCurrentProfile(req, { 
      json: (data) => data 
    });

    res.json({
      success: true,
      message: 'Profil berhasil diupdate',
      data: profile.data
    });

  } catch (error) {
    console.error('Error updating dosen profile:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate profil',
      error: error.message
    });
  }
};

// Update Password Dosen
exports.updatePassword = async (req, res) => {
  try {
    const dosenId = req.user.id;
    const { password_lama, password_baru, konfirmasi_password } = req.body;

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

    const [dosen] = await db.query(
      'SELECT password FROM dosen WHERE id = ?',
      [dosenId]
    );

    if (dosen.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dosen tidak ditemukan'
      });
    }

    const isPasswordValid = await bcrypt.compare(password_lama, dosen[0].password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Password lama tidak sesuai'
      });
    }

    const hashedPassword = await bcrypt.hash(password_baru, 10);

    await db.query(
      'UPDATE dosen SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, dosenId]
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
    const dosenId = req.user.id;
    const file = req.file;

    console.log('📸 Upload foto request:', {
      dosenId,
      file: file ? {
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype
      } : 'No file'
    });

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'File foto tidak ditemukan'
      });
    }

    const fotoUrl = `/uploads/profile/${file.filename}`;

    // Check if foto_profil column exists
    const columns = await checkAvailableColumns();
    
    if (!columns.includes('foto_profil')) {
      return res.status(400).json({
        success: false,
        message: 'Fitur upload foto belum tersedia. Hubungi administrator untuk menambahkan kolom foto_profil.'
      });
    }

    const [result] = await db.query(
      'UPDATE dosen SET foto_profil = ?, updated_at = NOW() WHERE id = ?',
      [fotoUrl, dosenId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dosen tidak ditemukan'
      });
    }

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
      message: 'Gagal mengupload foto profil',
      error: error.message
    });
  }
};