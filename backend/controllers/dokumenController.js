// backend/controllers/dokumenController.js
const db = require('../config/database');
const path = require('path');
const fs = require('fs');

// ============= DOSEN FUNCTIONS =============

// Get Mahasiswa Bimbingan dengan Progress Detail
exports.getMahasiswaBimbinganDetail = async (req, res) => {
  try {
    const dosenId = req.user.id;

    const [mahasiswa] = await db.query(`
      SELECT 
        m.id,
        m.nim,
        m.nama,
        m.email,
        m.no_telp,
        m.judul_ta,
        p.nama as program_studi_nama,
        p.kode as program_studi_kode,
        ta.status as status_ta,
        ta.id as tugas_akhir_id
      FROM mahasiswa m
      LEFT JOIN program_studi p ON m.program_studi_id = p.id
      LEFT JOIN tugas_akhir ta ON m.id = ta.mahasiswa_id
      WHERE m.dosen_pembimbing_id = ?
      ORDER BY m.nama ASC
    `, [dosenId]);

    res.json({
      success: true,
      data: mahasiswa
    });
  } catch (error) {
    console.error('Error getting mahasiswa detail:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data mahasiswa'
    });
  }
};

// Get Progress Mahasiswa
exports.getProgressMahasiswa = async (req, res) => {
  try {
    const { mahasiswaId } = req.params;
    const dosenId = req.user.id;

    const [mahasiswa] = await db.query(
      'SELECT * FROM mahasiswa WHERE id = ? AND dosen_pembimbing_id = ?',
      [mahasiswaId, dosenId]
    );

    if (mahasiswa.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mahasiswa tidak ditemukan'
      });
    }

    const [tugasAkhir] = await db.query(
      'SELECT * FROM tugas_akhir WHERE mahasiswa_id = ?',
      [mahasiswaId]
    );

    const [berkas] = await db.query(`
      SELECT 
        jenis_berkas,
        status,
        uploaded_at
      FROM berkas
      WHERE mahasiswa_id = ? AND status = 'Disetujui'
      ORDER BY uploaded_at ASC
    `, [mahasiswaId]);

    let statusProgress = tugasAkhir.length > 0 ? tugasAkhir[0].status : 'Proposal';
    let currentBab = 0;
    
    const approvedBabs = new Set();
    berkas.forEach(b => {
      const babMatch = b.jenis_berkas.match(/BAB\s*(\d+)/i);
      if (babMatch) {
        approvedBabs.add(parseInt(babMatch[1]));
      }
    });

    if (approvedBabs.size > 0) {
      currentBab = Math.max(...Array.from(approvedBabs));
    }

    const maxBab = statusProgress === 'Proposal' ? 3 : 5;

    res.json({
      success: true,
      data: {
        status: statusProgress,
        current_bab: currentBab,
        total_bab: maxBab,
        judul_ta: mahasiswa[0].judul_ta,
        approved_babs: Array.from(approvedBabs).sort()
      }
    });
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil progress mahasiswa'
    });
  }
};

// Get Riwayat Dokumen Mahasiswa
exports.getRiwayatDokumen = async (req, res) => {
  try {
    const { mahasiswaId } = req.params;
    const dosenId = req.user.id;

    const [mahasiswa] = await db.query(
      'SELECT * FROM mahasiswa WHERE id = ? AND dosen_pembimbing_id = ?',
      [mahasiswaId, dosenId]
    );

    if (mahasiswa.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mahasiswa tidak ditemukan'
      });
    }

    const [dokumen] = await db.query(`
      SELECT 
        id,
        jenis_berkas,
        nama_file,
        file_path,
        ukuran_file,
        status,
        catatan,
        uploaded_at
      FROM berkas
      WHERE mahasiswa_id = ?
      ORDER BY uploaded_at DESC
    `, [mahasiswaId]);

    res.json({
      success: true,
      data: dokumen
    });
  } catch (error) {
    console.error('Error getting riwayat dokumen:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil riwayat dokumen'
    });
  }
};

// Review Dokumen
exports.reviewDokumen = async (req, res) => {
  try {
    const { dokumenId } = req.params;
    const { status, catatan } = req.body;
    const dosenId = req.user.id;

    if (!['Disetujui', 'Ditolak'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    const [dokumen] = await db.query(`
      SELECT b.*, m.dosen_pembimbing_id
      FROM berkas b
      JOIN mahasiswa m ON b.mahasiswa_id = m.id
      WHERE b.id = ?
    `, [dokumenId]);

    if (dokumen.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dokumen tidak ditemukan'
      });
    }

    if (dokumen[0].dosen_pembimbing_id !== dosenId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk review dokumen ini'
      });
    }

    await db.query(
      'UPDATE berkas SET status = ?, catatan = ? WHERE id = ?',
      [status, catatan, dokumenId]
    );

    res.json({
      success: true,
      message: `Dokumen berhasil ${status === 'Disetujui' ? 'disetujui' : 'ditolak'}`
    });
  } catch (error) {
    console.error('Error reviewing dokumen:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mereview dokumen'
    });
  }
};

// Download Dokumen
exports.downloadDokumen = async (req, res) => {
  try {
    const { dokumenId } = req.params;
    const dosenId = req.user.id;

    const [dokumen] = await db.query(`
      SELECT b.*, m.dosen_pembimbing_id
      FROM berkas b
      JOIN mahasiswa m ON b.mahasiswa_id = m.id
      WHERE b.id = ?
    `, [dokumenId]);

    if (dokumen.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dokumen tidak ditemukan'
      });
    }

    if (dokumen[0].dosen_pembimbing_id !== dosenId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk mengunduh dokumen ini'
      });
    }

    const filePath = path.join(__dirname, '..', dokumen[0].file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File tidak ditemukan di server'
      });
    }

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${dokumen[0].nama_file}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading dokumen:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengunduh dokumen'
    });
  }
};

// View/Preview Dokumen
exports.viewDokumen = async (req, res) => {
  try {
    const { dokumenId } = req.params;
    const dosenId = req.user.id;

    const [dokumen] = await db.query(`
      SELECT b.*, m.dosen_pembimbing_id
      FROM berkas b
      JOIN mahasiswa m ON b.mahasiswa_id = m.id
      WHERE b.id = ?
    `, [dokumenId]);

    if (dokumen.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dokumen tidak ditemukan'
      });
    }

    if (dokumen[0].dosen_pembimbing_id !== dosenId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat dokumen ini'
      });
    }

    const filePath = path.join(__dirname, '..', dokumen[0].file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File tidak ditemukan di server'
      });
    }

    const ext = path.extname(dokumen[0].nama_file).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.doc') {
      contentType = 'application/msword';
    } else if (ext === '.docx') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${dokumen[0].nama_file}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error viewing dokumen:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menampilkan dokumen'
    });
  }
};

// ============= MAHASISWA FUNCTIONS =============

// Get Status Progress Mahasiswa
exports.getMahasiswaProgress = async (req, res) => {
  try {
    const mahasiswaId = req.user.id;

    const [tugasAkhir] = await db.query(
      'SELECT * FROM tugas_akhir WHERE mahasiswa_id = ?',
      [mahasiswaId]
    );

    const [berkas] = await db.query(`
      SELECT 
        jenis_berkas,
        status,
        uploaded_at
      FROM berkas
      WHERE mahasiswa_id = ? AND status = 'Disetujui'
      ORDER BY uploaded_at ASC
    `, [mahasiswaId]);

    let statusProgress = tugasAkhir.length > 0 ? tugasAkhir[0].status : 'Proposal';
    let currentBab = 0;
    let nextBab = 1;
    
    const approvedBabs = new Set();
    berkas.forEach(b => {
      const babMatch = b.jenis_berkas.match(/BAB\s*(\d+)/i);
      if (babMatch) {
        approvedBabs.add(parseInt(babMatch[1]));
      }
    });

    if (approvedBabs.size > 0) {
      currentBab = Math.max(...Array.from(approvedBabs));
      nextBab = currentBab + 1;
    }

    const maxBab = statusProgress === 'Proposal' ? 3 : 5;

    res.json({
      success: true,
      data: {
        status: statusProgress,
        current_bab: currentBab,
        next_bab: nextBab,
        max_bab: maxBab,
        can_upload_next: nextBab <= maxBab,
        can_access_ta: statusProgress === 'TA' || currentBab >= 3,
        approved_babs: Array.from(approvedBabs).sort()
      }
    });
  } catch (error) {
    console.error('Error getting mahasiswa progress:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil progress'
    });
  }
};

// Upload Dokumen (dengan multer)
exports.uploadDokumen = async (req, res) => {
  try {
    const mahasiswaId = req.user.id;
    const { jenis_berkas, catatan } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'File wajib diupload'
      });
    }

    if (!jenis_berkas) {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: 'Jenis berkas wajib diisi'
      });
    }

    const babMatch = jenis_berkas.match(/BAB\s*(\d+)/i);
    if (!babMatch) {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: 'Format jenis berkas tidak valid. Gunakan format "Proposal BAB X" atau "TA BAB X"'
      });
    }

    const uploadBab = parseInt(babMatch[1]);

    const [tugasAkhir] = await db.query(
      'SELECT * FROM tugas_akhir WHERE mahasiswa_id = ?',
      [mahasiswaId]
    );

    const statusProgress = tugasAkhir.length > 0 ? tugasAkhir[0].status : 'Proposal';
    const maxBab = statusProgress === 'Proposal' ? 3 : 5;

    const [approvedBerkas] = await db.query(`
      SELECT jenis_berkas
      FROM berkas
      WHERE mahasiswa_id = ? AND status = 'Disetujui'
    `, [mahasiswaId]);

    let highestApprovedBab = 0;
    approvedBerkas.forEach(b => {
      const match = b.jenis_berkas.match(/BAB\s*(\d+)/i);
      if (match) {
        const bab = parseInt(match[1]);
        if (bab > highestApprovedBab) {
          highestApprovedBab = bab;
        }
      }
    });

    const nextAllowedBab = highestApprovedBab + 1;
    
    if (uploadBab !== nextAllowedBab) {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: `Anda hanya bisa mengupload BAB ${nextAllowedBab}. Selesaikan BAB sebelumnya terlebih dahulu.`
      });
    }

    if (uploadBab > maxBab) {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: `Anda tidak bisa mengupload BAB ${uploadBab}. Status Anda saat ini adalah ${statusProgress} (maksimal BAB ${maxBab}).`
      });
    }

    const [pendingDokumen] = await db.query(`
      SELECT * FROM berkas
      WHERE mahasiswa_id = ? AND jenis_berkas = ? AND status = 'Menunggu'
    `, [mahasiswaId, jenis_berkas]);

    if (pendingDokumen.length > 0) {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: 'Anda sudah memiliki dokumen yang sedang menunggu review untuk BAB ini.'
      });
    }

    const berkasId = `berkas_${Date.now()}`;
    const file_path = `/uploads/${mahasiswaId}/${file.filename}`;

    await db.query(
      `INSERT INTO berkas (id, mahasiswa_id, jenis_berkas, nama_file, file_path, ukuran_file, status, catatan, uploaded_at)
       VALUES (?, ?, ?, ?, ?, ?, 'Menunggu', ?, NOW())`,
      [berkasId, mahasiswaId, jenis_berkas, file.originalname, file_path, file.size, catatan]
    );

    res.status(201).json({
      success: true,
      message: 'Dokumen berhasil diupload dan menunggu review dosen',
      data: { 
        id: berkasId,
        nama_file: file.originalname,
        ukuran: file.size
      }
    });
  } catch (error) {
    console.error('Error uploading dokumen:', error);
    
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Gagal mengupload dokumen'
    });
  }
};

// Get Dokumen Mahasiswa
exports.getMahasiswaDokumen = async (req, res) => {
  try {
    const mahasiswaId = req.user.id;

    const [dokumen] = await db.query(`
      SELECT 
        id,
        jenis_berkas,
        nama_file,
        status,
        catatan,
        uploaded_at
      FROM berkas
      WHERE mahasiswa_id = ?
      ORDER BY uploaded_at DESC
    `, [mahasiswaId]);

    res.json({
      success: true,
      data: dokumen
    });
  } catch (error) {
    console.error('Error getting mahasiswa dokumen:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil dokumen'
    });
  }
};

// Update Status Mahasiswa
exports.updateMahasiswaStatus = async (req, res) => {
  try {
    const { mahasiswaId } = req.params;
    const { status, current_bab } = req.body;
    const dosenId = req.user.id;

    if (!status || !current_bab) {
      return res.status(400).json({
        success: false,
        message: 'Status dan current_bab wajib diisi'
      });
    }

    const [mahasiswa] = await db.query(
      'SELECT * FROM mahasiswa WHERE id = ? AND dosen_pembimbing_id = ?',
      [mahasiswaId, dosenId]
    );

    if (mahasiswa.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mahasiswa tidak ditemukan'
      });
    }

    const [existingTA] = await db.query(
      'SELECT * FROM tugas_akhir WHERE mahasiswa_id = ?',
      [mahasiswaId]
    );

    if (existingTA.length > 0) {
      await db.query(
        'UPDATE tugas_akhir SET status = ?, updated_at = NOW() WHERE mahasiswa_id = ?',
        [status, mahasiswaId]
      );
    } else {
      const taId = `ta_${Date.now()}`;
      await db.query(
        `INSERT INTO tugas_akhir (id, mahasiswa_id, judul, status, updated_at, created_at)
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [taId, mahasiswaId, mahasiswa[0].judul_ta || 'Belum ada judul', status]
      );
    }

    res.json({
      success: true,
      message: 'Status mahasiswa berhasil diupdate'
    });
  } catch (error) {
    console.error('Error updating mahasiswa status:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate status mahasiswa'
    });
  }
};