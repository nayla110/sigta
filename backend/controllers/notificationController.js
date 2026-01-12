const db = require('../config/database');

// ============================================
// NOTIFICATION FUNCTIONS FOR DOSEN
// ============================================

// Get All Notifications for Current Dosen
exports.getDosenNotifications = async (req, res) => {
  try {
    const dosenId = req.user.id;
    const { limit = 10, offset = 0 } = req.query;

    const [notifications] = await db.query(`
      SELECT 
        n.id,
        n.type,
        n.title,
        n.message,
        n.link,
        n.is_read,
        n.created_at,
        CASE 
          WHEN TIMESTAMPDIFF(MINUTE, n.created_at, NOW()) < 60 
            THEN CONCAT(TIMESTAMPDIFF(MINUTE, n.created_at, NOW()), ' menit yang lalu')
          WHEN TIMESTAMPDIFF(HOUR, n.created_at, NOW()) < 24 
            THEN CONCAT(TIMESTAMPDIFF(HOUR, n.created_at, NOW()), ' jam yang lalu')
          WHEN TIMESTAMPDIFF(DAY, n.created_at, NOW()) < 7 
            THEN CONCAT(TIMESTAMPDIFF(DAY, n.created_at, NOW()), ' hari yang lalu')
          ELSE DATE_FORMAT(n.created_at, '%d %M %Y')
        END as time_ago
      FROM notifications n
      WHERE n.user_id = ? AND n.user_type = 'dosen'
      ORDER BY n.created_at DESC
      LIMIT ? OFFSET ?
    `, [dosenId, parseInt(limit), parseInt(offset)]);

    // Get unread count
    const [countResult] = await db.query(
      'SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND user_type = "dosen" AND is_read = 0',
      [dosenId]
    );

    res.json({
      success: true,
      data: {
        notifications: notifications.map(n => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          link: n.link,
          read: n.is_read === 1,
          time: n.time_ago,
          created_at: n.created_at
        })),
        unread_count: countResult[0].unread_count
      }
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil notifikasi'
    });
  }
};

// Get Unread Count
exports.getUnreadCount = async (req, res) => {
  try {
    const dosenId = req.user.id;

    const [result] = await db.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND user_type = "dosen" AND is_read = 0',
      [dosenId]
    );

    res.json({
      success: true,
      data: {
        unread_count: result[0].count
      }
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil jumlah notifikasi'
    });
  }
};

// Mark Notification as Read
exports.markAsRead = async (req, res) => {
  try {
    const dosenId = req.user.id;
    const { id } = req.params;

    const [result] = await db.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ? AND user_type = "dosen"',
      [id, dosenId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notifikasi tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Notifikasi ditandai sebagai dibaca'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menandai notifikasi'
    });
  }
};

// Mark All as Read
exports.markAllAsRead = async (req, res) => {
  try {
    const dosenId = req.user.id;

    await db.query(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND user_type = "dosen" AND is_read = 0',
      [dosenId]
    );

    res.json({
      success: true,
      message: 'Semua notifikasi ditandai sebagai dibaca'
    });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menandai semua notifikasi'
    });
  }
};

// Delete Notification
exports.deleteNotification = async (req, res) => {
  try {
    const dosenId = req.user.id;
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM notifications WHERE id = ? AND user_id = ? AND user_type = "dosen"',
      [id, dosenId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notifikasi tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Notifikasi berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus notifikasi'
    });
  }
};

// ============================================
// CREATE NOTIFICATION (Helper Function)
// ============================================

exports.createNotification = async (userId, userType, type, title, message, link = null) => {
  try {
    const notificationId = `notif_${Date.now()}`;
    
    await db.query(
      `INSERT INTO notifications (id, user_id, user_type, type, title, message, link, is_read, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, NOW())`,
      [notificationId, userId, userType, type, title, message, link]
    );

    return { success: true, id: notificationId };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// AUTO-CREATE NOTIFICATIONS (Examples)
// ============================================

// Ketika mahasiswa ajukan bimbingan
exports.notifyNewBimbingan = async (dosenId, mahasiswaNama, tanggal) => {
  return exports.createNotification(
    dosenId,
    'dosen',
    'bimbingan',
    'Pengajuan Bimbingan Baru',
    `${mahasiswaNama} mengajukan bimbingan untuk tanggal ${tanggal}`,
    '/dosen/bimbingan'
  );
};

// Ketika mahasiswa upload dokumen
exports.notifyNewDokumen = async (dosenId, mahasiswaNama, judulDokumen) => {
  return exports.createNotification(
    dosenId,
    'dosen',
    'dokumen',
    'Dokumen Baru Diupload',
    `${mahasiswaNama} telah mengupload ${judulDokumen}`,
    '/dosen/dokumen'
  );
};

// Reminder bimbingan besok
exports.notifyBimbinganReminder = async (dosenId, mahasiswaNama, waktu) => {
  return exports.createNotification(
    dosenId,
    'dosen',
    'bimbingan',
    'Reminder Bimbingan',
    `Anda memiliki jadwal bimbingan dengan ${mahasiswaNama} besok pukul ${waktu}`,
    '/dosen/jadwal-bimbingan'
  );
};