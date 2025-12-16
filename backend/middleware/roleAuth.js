// Middleware untuk authorization berdasarkan role

exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak. Hanya admin yang dapat mengakses fitur ini.'
    });
  }
  next();
};

exports.requireDosen = (req, res, next) => {
  if (req.user.role !== 'dosen') {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak. Hanya dosen yang dapat mengakses fitur ini.'
    });
  }
  next();
};

exports.requireMahasiswa = (req, res, next) => {
  if (req.user.role !== 'mahasiswa') {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak. Hanya mahasiswa yang dapat mengakses fitur ini.'
    });
  }
  next();
};

// Middleware untuk multiple roles
exports.requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Anda tidak memiliki izin untuk mengakses fitur ini.'
      });
    }
    next();
  };
};