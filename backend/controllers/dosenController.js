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

// Get Current Dosen Profile (yang sedang login)
exports.getCurrentProfile = async (req, res) => {
  try {
    const dosenId = req.user.id; // Dari middleware auth

    const [dosen] = await db.query(`
      SELECT d.id, d.nik, d.nama, d.email, d.no_telp, 
             d.alamat, d.tanggal_lahir, d.jenis_kelamin, 
             d.pendidikan_terakhir, d.bidang_keahlian, d.foto_profil,
             p.nama as program_studi_nama, p.jenjang as program_studi_jenjang
      FROM dosen d
      LEFT JOIN program_studi p ON d.program_studi_id = p.id
      WHERE d.id = ?
    `, [dosenId]);

    if (dosen.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Profil dosen tidak ditemukan'
      });
    }

    // Parse bidang_keahlian jika dalam bentuk JSON string
    const dosenData = dosen[0];
    if (typeof dosenData.bidang_keahlian === 'string') {
      try {
        dosenData.bidang_keahlian = JSON.parse(dosenData.bidang_keahlian);
      } catch (e) {}
    }

    // Hitung jumlah mahasiswa bimbingan
    const [mahasiswaCount] = await db.query(
      'SELECT COUNT(*) as total FROM mahasiswa WHERE dosen_pembimbing_id = ?',
      [dosenId]
    );

    res.json({
      success: true,
      data: {
        ...dosenData,
        total_mahasiswa_bimbingan: mahasiswaCount[0].total
      }
    });
  } catch (error) {
    console.error('Error getting dosen profile:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil profil dosen'
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

// ===== ⭐⭐⭐ TAMBAHAN BARU: UPDATE PROFILE ⭐⭐⭐ =====

// Update Profile Dosen (dengan field lengkap)
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
      bidang_keahlian,
      foto_profil 
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
      if (!phoneRegex.test(no_telp)) {
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

    const bidangKeahlianStr = Array.isArray(bidang_keahlian) 
      ? JSON.stringify(bidang_keahlian) 
      : bidang_keahlian;

    await db.query(
      `UPDATE dosen 
       SET nama = ?, email = ?, no_telp = ?, alamat = ?,
           tanggal_lahir = ?, jenis_kelamin = ?, pendidikan_terakhir = ?,
           bidang_keahlian = ?, foto_profil = ?, updated_at = NOW()
       WHERE id = ?`,
      [nama, email, no_telp, alamat, tanggal_lahir, jenis_kelamin, 
       pendidikan_terakhir, bidangKeahlianStr, foto_profil, dosenId]
    );

    const [updated] = await db.query(
      `SELECT d.id, d.nik, d.nama, d.email, d.no_telp, d.alamat,
              d.tanggal_lahir, d.jenis_kelamin, d.pendidikan_terakhir,
              d.bidang_keahlian, d.foto_profil,
              p.nama as program_studi_nama
       FROM dosen d
       LEFT JOIN program_studi p ON d.program_studi_id = p.id
       WHERE d.id = ?`,
      [dosenId]
    );

    const dosenData = updated[0];
    if (typeof dosenData.bidang_keahlian === 'string') {
      try {
        dosenData.bidang_keahlian = JSON.parse(dosenData.bidang_keahlian);
      } catch (e) {}
    }

    res.json({
      success: true,
      message: 'Profile berhasil diupdate',
      data: dosenData
    });
  } catch (error) {
    console.error('Error updating dosen profile:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate profile'
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

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'File foto tidak ditemukan'
      });
    }

    const fotoUrl = `/uploads/profile/${file.filename}`;

    await db.query(
      'UPDATE dosen SET foto_profil = ?, updated_at = NOW() WHERE id = ?',
      [fotoUrl, dosenId]
    );

    res.json({
      success: true,
      message: 'Foto profile berhasil diupload',
      data: {
        foto_profil: fotoUrl
      }
    });
  } catch (error) {
    console.error('Error uploading foto profile:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupload foto profile'
    });
  }
};