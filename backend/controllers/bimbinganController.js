const db = require('../config/database');

// ============= MAHASISWA FUNCTIONS =============

// Create Pengajuan Bimbingan (Mahasiswa)
exports.createPengajuan = async (req, res) => {
  try {
    const mahasiswaId = req.user.id;
    const { tanggal, waktu, metode, topik } = req.body;

    // Validasi input
    if (!tanggal || !waktu || !metode || !topik) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      });
    }

    // Get mahasiswa info untuk mendapatkan dosen_pembimbing_id
    const [mahasiswa] = await db.query(
      'SELECT dosen_pembimbing_id FROM mahasiswa WHERE id = ?',
      [mahasiswaId]
    );

    if (mahasiswa.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data mahasiswa tidak ditemukan'
      });
    }

    if (!mahasiswa[0].dosen_pembimbing_id) {
      return res.status(400).json({
        success: false,
        message: 'Anda belum memiliki dosen pembimbing'
      });
    }

    // Gabungkan tanggal dan waktu
    const tanggalWaktu = `${tanggal} ${waktu}:00`;

    // Generate ID
    const bimbinganId = `bimbingan_${Date.now()}`;

    // Insert bimbingan dengan status Menunggu
    await db.query(
      `INSERT INTO bimbingan (id, mahasiswa_id, dosen_id, tanggal, topik, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'Menunggu', NOW(), NOW())`,
      [bimbinganId, mahasiswaId, mahasiswa[0].dosen_pembimbing_id, tanggalWaktu, `${topik} (${metode})`]
    );

    res.status(201).json({
      success: true,
      message: 'Pengajuan bimbingan berhasil dikirim',
      data: { id: bimbinganId }
    });
  } catch (error) {
    console.error('Error creating pengajuan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengirim pengajuan bimbingan'
    });
  }
};

// Get Bimbingan List (Mahasiswa)
exports.getMahasiswaBimbingan = async (req, res) => {
  try {
    const mahasiswaId = req.user.id;

    const [bimbingan] = await db.query(`
      SELECT b.id, b.tanggal, b.topik, b.status, b.catatan,
             d.nama as dosen_nama
      FROM bimbingan b
      LEFT JOIN dosen d ON b.dosen_id = d.id
      WHERE b.mahasiswa_id = ?
      ORDER BY b.tanggal DESC
    `, [mahasiswaId]);

    res.json({
      success: true,
      data: bimbingan
    });
  } catch (error) {
    console.error('Error getting mahasiswa bimbingan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data bimbingan'
    });
  }
};

// ============= DOSEN FUNCTIONS =============

// Get Pengajuan Bimbingan (Dosen)
exports.getDosenPengajuan = async (req, res) => {
  try {
    const dosenId = req.user.id;
    const { status } = req.query; // Filter by status: 'Menunggu', 'Disetujui', 'Ditolak'

    let query = `
      SELECT b.id, b.tanggal, b.topik, b.status, b.catatan, b.created_at,
             m.nim, m.nama as mahasiswa_nama,
             p.nama as program_studi_nama, p.kode as program_studi_kode
      FROM bimbingan b
      LEFT JOIN mahasiswa m ON b.mahasiswa_id = m.id
      LEFT JOIN program_studi p ON m.program_studi_id = p.id
      WHERE b.dosen_id = ?
    `;

    const params = [dosenId];

    if (status) {
      query += ` AND b.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY b.created_at DESC`;

    const [pengajuan] = await db.query(query, params);

    res.json({
      success: true,
      data: pengajuan
    });
  } catch (error) {
    console.error('Error getting dosen pengajuan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pengajuan'
    });
  }
};

// Update Status Pengajuan (Dosen: Terima/Tolak)
exports.updateStatusPengajuan = async (req, res) => {
  try {
    const dosenId = req.user.id;
    const { id } = req.params;
    const { status, catatan } = req.body; // status: 'Disetujui' atau 'Ditolak'

    // Validasi status
    if (!['Disetujui', 'Ditolak'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid. Gunakan "Disetujui" atau "Ditolak"'
      });
    }

    // Cek apakah bimbingan ada dan milik dosen ini
    const [existing] = await db.query(
      'SELECT * FROM bimbingan WHERE id = ? AND dosen_id = ?',
      [id, dosenId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengajuan bimbingan tidak ditemukan'
      });
    }

    // Update status
    await db.query(
      `UPDATE bimbingan 
       SET status = ?, catatan = ?, updated_at = NOW()
       WHERE id = ?`,
      [status, catatan || null, id]
    );

    res.json({
      success: true,
      message: `Pengajuan berhasil ${status === 'Disetujui' ? 'disetujui' : 'ditolak'}`
    });
  } catch (error) {
    console.error('Error updating status pengajuan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate status pengajuan'
    });
  }
};

// Update Catatan Bimbingan (Dosen)
exports.updateCatatanBimbingan = async (req, res) => {
  try {
    const dosenId = req.user.id;
    const { id } = req.params;
    const { catatan } = req.body;

    // Cek apakah bimbingan ada dan milik dosen ini
    const [existing] = await db.query(
      'SELECT * FROM bimbingan WHERE id = ? AND dosen_id = ?',
      [id, dosenId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bimbingan tidak ditemukan'
      });
    }

    // Update catatan
    await db.query(
      `UPDATE bimbingan 
       SET catatan = ?, updated_at = NOW()
       WHERE id = ?`,
      [catatan, id]
    );

    res.json({
      success: true,
      message: 'Catatan berhasil diupdate'
    });
  } catch (error) {
    console.error('Error updating catatan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate catatan'
    });
  }
};

// Tandai Selesai (Dosen)
exports.tandaiSelesai = async (req, res) => {
  try {
    const dosenId = req.user.id;
    const { id } = req.params;

    // Cek apakah bimbingan ada dan milik dosen ini
    const [existing] = await db.query(
      'SELECT * FROM bimbingan WHERE id = ? AND dosen_id = ? AND status = "Disetujui"',
      [id, dosenId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bimbingan tidak ditemukan atau belum disetujui'
      });
    }

    // Update status ke Selesai
    await db.query(
      `UPDATE bimbingan 
       SET status = 'Selesai', updated_at = NOW()
       WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Bimbingan berhasil ditandai selesai'
    });
  } catch (error) {
    console.error('Error tandai selesai:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menandai bimbingan selesai'
    });
  }
};