const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi storage untuk foto profile
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/profile');
    
    // Buat folder jika belum ada
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const userId = req.user.id;
    const role = req.user.role; // mahasiswa atau dosen
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${role}_${userId}_${timestamp}${ext}`);
  }
});

// Filter file hanya gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (JPG, PNG, WEBP) yang diperbolehkan'), false);
  }
};

const uploadProfile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

module.exports = uploadProfile;