// backend/controllers/dokumenController.js
const db = require('../config/database');

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

// Get Progress Mahasiswa (Bab berapa)
exports.getProgressMahasiswa = async (req, res) => {
  try {
    const { mahasiswaId } = req.params;
    const dosenId = req.user.id;

    // Verifikasi bahwa mahasiswa adalah bimbingan dosen ini
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

    // Get tugas akhir info
    const [tugasAkhir] = await db.query(
      'SELECT * FROM tugas_akhir WHERE mahasiswa_id = ?',
      [mahasiswaId]
    );

    // Get berkas terakhir untuk menentukan progress bab
    const [berkas] = await db.query(`
      SELECT 
        jenis_berkas,
        COUNT(*) as total_upload,
        MAX(uploaded_at) as last_upload,
        SUM(CASE WHEN status = 'Disetujui' THEN 1 ELSE 0 END) as total_approved
      FROM berkas
      WHERE mahasiswa_id = ?
      GROUP BY jenis_berkas
      ORDER BY last_upload DESC
    `, [mahasiswaId]);

    // Tentukan status progress
    let statusProgress = 'Proposal';
    let currentBab = 0;

    if (tugasAkhir.length > 0) {
      statusProgress = tugasAkhir[0].status;
    }

    // Hitung progress bab dari berkas yang diupload
    const babPattern = /BAB\s*(\d+)/i;
    berkas.forEach(b => {
      const match = b.jenis_berkas.match(babPattern);
      if (match) {
        const babNum = parseInt(match[1]);
        if (babNum > currentBab) {
          currentBab = babNum;
        }
      }
    });

    res.json({
      success: true,
      data: {
        status: statusProgress,
        current_bab: currentBab,
        total_bab: statusProgress === 'Proposal' ? 3 : 5,
        judul_ta: mahasiswa[0].judul_ta,
        berkas_summary: berkas
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

    // Verifikasi mahasiswa
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

    // Get riwayat dokumen
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

// Review Dokumen (Approve/Reject)
exports.reviewDokumen = async (req, res) => {
  try {
    const { dokumenId } = req.params;
    const { status, catatan } = req.body;
    const dosenId = req.user.id;

    // Validasi status
    if (!['Disetujui', 'Ditolak'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    // Cek apakah dokumen ada dan milik mahasiswa bimbingan dosen ini
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

    // Update status dokumen
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

// ============= MAHASISWA FUNCTIONS =============

// Get Status Progress Mahasiswa (untuk validasi upload)
exports.getMahasiswaProgress = async (req, res) => {
  try {
    const mahasiswaId = req.user.id;

    // Get tugas akhir info
    const [tugasAkhir] = await db.query(
      'SELECT * FROM tugas_akhir WHERE mahasiswa_id = ?',
      [mahasiswaId]
    );

    // Get berkas yang sudah disetujui untuk menentukan BAB yang bisa diakses
    const [berkas] = await db.query(`
      SELECT 
        jenis_berkas,
        status,
        uploaded_at
      FROM berkas
      WHERE mahasiswa_id = ? AND status = 'Disetujui'
      ORDER BY uploaded_at ASC
    `, [mahasiswaId]);

    // Tentukan status dan bab yang bisa diakses
    let statusProgress = tugasAkhir.length > 0 ? tugasAkhir[0].status : 'Proposal';
    let currentBab = 0; // BAB terakhir yang sudah disetujui
    let nextBab = 1; // BAB yang bisa diupload selanjutnya
    
    // Hitung BAB dari berkas yang sudah disetujui
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

    // Tentukan bab maksimal berdasarkan status
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

// Upload Dokumen (Mahasiswa)
exports.uploadDokumen = async (req, res) => {
  try {
    const mahasiswaId = req.user.id;
    const { jenis_berkas, nama_file, catatan } = req.body;

    // Validasi input
    if (!jenis_berkas || !nama_file) {
      return res.status(400).json({
        success: false,
        message: 'Jenis berkas dan nama file wajib diisi'
      });
    }

    // Extract BAB number dari jenis_berkas
    const babMatch = jenis_berkas.match(/BAB\s*(\d+)/i);
    if (!babMatch) {
      return res.status(400).json({
        success: false,
        message: 'Format jenis berkas tidak valid. Gunakan format "Proposal BAB X" atau "TA BAB X"'
      });
    }

    const uploadBab = parseInt(babMatch[1]);

    // Get progress mahasiswa untuk validasi
    const [tugasAkhir] = await db.query(
      'SELECT * FROM tugas_akhir WHERE mahasiswa_id = ?',
      [mahasiswaId]
    );

    const statusProgress = tugasAkhir.length > 0 ? tugasAkhir[0].status : 'Proposal';
    const maxBab = statusProgress === 'Proposal' ? 3 : 5;

    // Get berkas yang sudah disetujui
    const [approvedBerkas] = await db.query(`
      SELECT jenis_berkas
      FROM berkas
      WHERE mahasiswa_id = ? AND status = 'Disetujui'
    `, [mahasiswaId]);

    // Cari BAB tertinggi yang sudah disetujui
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

    // Validasi: hanya bisa upload BAB selanjutnya setelah BAB sebelumnya disetujui
    const nextAllowedBab = highestApprovedBab + 1;
    
    if (uploadBab !== nextAllowedBab) {
      return res.status(400).json({
        success: false,
        message: `Anda hanya bisa mengupload BAB ${nextAllowedBab}. Selesaikan BAB sebelumnya terlebih dahulu.`,
        data: {
          current_approved_bab: highestApprovedBab,
          next_allowed_bab: nextAllowedBab,
          attempted_bab: uploadBab
        }
      });
    }

    // Validasi: tidak boleh melebihi max BAB
    if (uploadBab > maxBab) {
      return res.status(400).json({
        success: false,
        message: `Anda tidak bisa mengupload BAB ${uploadBab}. Status Anda saat ini adalah ${statusProgress} (maksimal BAB ${maxBab}).`
      });
    }

    // Cek apakah sudah ada dokumen pending untuk BAB ini
    const [pendingDokumen] = await db.query(`
      SELECT * FROM berkas
      WHERE mahasiswa_id = ? AND jenis_berkas = ? AND status = 'Menunggu'
    `, [mahasiswaId, jenis_berkas]);

    if (pendingDokumen.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Anda sudah memiliki dokumen yang sedang menunggu review untuk BAB ini.'
      });
    }

    // Generate ID dan file_path
    const berkasId = `berkas_${Date.now()}`;
    const file_path = `/uploads/${mahasiswaId}/${nama_file}`;

    // Insert berkas
    await db.query(
      `INSERT INTO berkas (id, mahasiswa_id, jenis_berkas, nama_file, file_path, status, catatan, uploaded_at)
       VALUES (?, ?, ?, ?, ?, 'Menunggu', ?, NOW())`,
      [berkasId, mahasiswaId, jenis_berkas, nama_file, file_path, catatan]
    );

    res.status(201).json({
      success: true,
      message: 'Dokumen berhasil diupload dan menunggu review dosen',
      data: { id: berkasId }
    });
  } catch (error) {
    console.error('Error uploading dokumen:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupload dokumen'
    });
  }
};

// Get Dokumen Mahasiswa (untuk ditampilkan di halaman mahasiswa)
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

// Update Status Progress by Dosen (untuk mengubah status mahasiswa)
exports.updateMahasiswaStatus = async (req, res) => {
  try {
    const { mahasiswaId } = req.params;
    const { status, current_bab } = req.body;
    const dosenId = req.user.id;

    // Validasi input
    if (!status || !current_bab) {
      return res.status(400).json({
        success: false,
        message: 'Status dan current_bab wajib diisi'
      });
    }

    // Verifikasi mahasiswa adalah bimbingan dosen ini
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

    // Check jika tugas_akhir sudah ada
    const [existingTA] = await db.query(
      'SELECT * FROM tugas_akhir WHERE mahasiswa_id = ?',
      [mahasiswaId]
    );

    if (existingTA.length > 0) {
      // Update
      await db.query(
        'UPDATE tugas_akhir SET status = ?, updated_at = NOW() WHERE mahasiswa_id = ?',
        [status, mahasiswaId]
      );
    } else {
      // Insert
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