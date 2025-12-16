const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Total mahasiswa bimbingan
    const [mahasiswaCount] = await db.query(
      'SELECT COUNT(*) as total FROM mahasiswa'
    );

    // Total dosen pembimbing
    const [dosenCount] = await db.query(
      'SELECT COUNT(*) as total FROM dosen'
    );

    res.json({
      success: true,
      data: {
        totalMahasiswa: mahasiswaCount[0].total,
        totalDosen: dosenCount[0].total
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik dashboard'
    });
  }
};

// Login Admin
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username dan password harus diisi'
      });
    }

    // Cari admin berdasarkan username
    const [admins] = await db.query(
      'SELECT * FROM admin WHERE username = ?',
      [username]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah'
      });
    }

    const admin = admins[0];

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username,
        role: 'admin' 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Simpan session ke database
    await db.query(
      `INSERT INTO session (id, user_id, user_type, token, expires_at) 
       VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
      [`session_${Date.now()}`, admin.id, 'admin', token]
    );

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          nama: admin.nama,
          email: admin.email
        }
      }
    });
  } catch (error) {
    console.error('Error login admin:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login'
    });
  }
};

// Logout Admin
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

// Get Admin Profile
exports.getProfile = async (req, res) => {
  try {
    const adminId = req.user.id;

    const [admins] = await db.query(
      'SELECT id, username, email, nama, no_telp FROM admin WHERE id = ?',
      [adminId]
    );

    if (admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: admins[0]
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil profil'
    });
  }
};