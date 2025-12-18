const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi storage untuk multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ambil mahasiswa_id dari req.user (dari JWT token)
    const mahasiswaId = req.user.id;
    const uploadPath = path.join(__dirname, '../uploads', mahasiswaId);
    
    // Buat folder jika belum ada
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate nama file: timestamp_originalname
    const uniqueSuffix = Date.now();
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${uniqueSuffix}_${basename}${ext}`);
  }
});

// Filter file (hanya terima PDF, DOC, DOCX)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file PDF, DOC, atau DOCX yang diperbolehkan'), false);
  }
};

// Konfigurasi multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

module.exports = upload;