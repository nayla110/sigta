const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

// Semua routes butuh authentication
router.use(authenticate);

// Get all notifications
router.get('/', notificationController.getDosenNotifications);

// Get unread count
router.get('/unread-count', notificationController.getUnreadCount);

// Mark as read
router.put('/:id/read', notificationController.markAsRead);

// Mark all as read
router.put('/read-all', notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;