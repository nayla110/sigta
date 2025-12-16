const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login Mahasiswa (menggunakan NIM dan password)
exports.loginMahasiswa = async (req, res) => {
  try {
    const { nim, password } = req.body;

    // Validasi input
    if (!nim || !password) {
      return res.status(400).json({
        success: false,
        message: 'NIM dan password harus diisi'
      });
    }

    // Cari mahasiswa berdasarkan NIM
    const [mahasiswa] = await db.query(
      `SELECT m.*, p.nama as program_studi_nama, d.nama as dosen_pembimbing_nama
       FROM mahasiswa m
       LEFT JOIN program_studi p ON m.program_studi_id = p.id
       LEFT JOIN dosen d ON m.dosen_pembimbing_id = d.id
       WHERE m.nim = ?`,
      [nim]
    );

    if (mahasiswa.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'NIM atau password salah'
      });
    }

    const mhs = mahasiswa[0];

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, mhs.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'NIM atau password salah'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: mhs.id, 
        nim: mhs.nim,
        role: 'mahasiswa' 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Simpan session ke database
    await db.query(
      `INSERT INTO session (id, user_id, user_type, token, expires_at) 
       VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
      [`session_${Date.now()}`, mhs.id, 'mahasiswa', token]
    );

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        mahasiswa: {
          id: mhs.id,
          nim: mhs.nim,
          nama: mhs.nama,
          email: mhs.email,
          no_telp: mhs.no_telp,
          program_studi_id: mhs.program_studi_id,
          program_studi_nama: mhs.program_studi_nama,
          dosen_pembimbing_id: mhs.dosen_pembimbing_id,
          dosen_pembimbing_nama: mhs.dosen_pembimbing_nama,
          judul_ta: mhs.judul_ta
        }
      }
    });
  } catch (error) {
    console.error('Error login mahasiswa:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login'
    });
  }
};

// Login Dosen (menggunakan NIK dan password)
exports.loginDosen = async (req, res) => {
  try {
    const { nik, password } = req.body;

    // Validasi input
    if (!nik || !password) {
      return res.status(400).json({
        success: false,
        message: 'NIK dan password harus diisi'
      });
    }

    // Cari dosen berdasarkan NIK
    const [dosen] = await db.query(
      `SELECT d.*, p.nama as program_studi_nama
       FROM dosen d
       LEFT JOIN program_studi p ON d.program_studi_id = p.id
       WHERE d.nik = ?`,
      [nik]
    );

    if (dosen.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'NIK atau password salah'
      });
    }

    const dsn = dosen[0];

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, dsn.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'NIK atau password salah'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: dsn.id, 
        nik: dsn.nik,
        role: 'dosen' 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Simpan session ke database
    await db.query(
      `INSERT INTO session (id, user_id, user_type, token, expires_at) 
       VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
      [`session_${Date.now()}`, dsn.id, 'dosen', token]
    );

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        dosen: {
          id: dsn.id,
          nik: dsn.nik,
          nama: dsn.nama,
          email: dsn.email,
          no_telp: dsn.no_telp,
          program_studi_id: dsn.program_studi_id,
          program_studi_nama: dsn.program_studi_nama
        }
      }
    });
  } catch (error) {
    console.error('Error login dosen:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login'
    });
  }
};

// Logout Universal (untuk semua role)
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      await db.query('DELETE FROM session WHERE token = ?', [token]);
    }

    res.json({
      success: true,
      message: 'Logout berhasil'
    });
  } catch (error) {
    console.error('Error logout:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal logout'
    });
  }
};

// Get Profile Mahasiswa
exports.getMahasiswaProfile = async (req, res) => {
  try {
    const mahasiswaId = req.user.id;

    const [mahasiswa] = await db.query(
      `SELECT m.*, 
              p.nama as program_studi_nama,
              d.nama as dosen_pembimbing_nama
       FROM mahasiswa m
       LEFT JOIN program_studi p ON m.program_studi_id = p.id
       LEFT JOIN dosen d ON m.dosen_pembimbing_id = d.id
       WHERE m.id = ?`,
      [mahasiswaId]
    );

    if (mahasiswa.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mahasiswa tidak ditemukan'
      });
    }

    // Hapus password dari response
    const { password, ...mahasiswaData } = mahasiswa[0];

    res.json({
      success: true,
      data: mahasiswaData
    });
  } catch (error) {
    console.error('Error getting mahasiswa profile:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil profil'
    });
  }
};

// Get Profile Dosen
exports.getDosenProfile = async (req, res) => {
  try {
    const dosenId = req.user.id;

    const [dosen] = await db.query(
      `SELECT d.*, 
              p.nama as program_studi_nama
       FROM dosen d
       LEFT JOIN program_studi p ON d.program_studi_id = p.id
       WHERE d.id = ?`,
      [dosenId]
    );

    if (dosen.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dosen tidak ditemukan'
      });
    }

    // Hapus password dari response
    const { password, ...dosenData } = dosen[0];

    res.json({
      success: true,
      data: dosenData
    });
  } catch (error) {
    console.error('Error getting dosen profile:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil profil'
    });
  }
};