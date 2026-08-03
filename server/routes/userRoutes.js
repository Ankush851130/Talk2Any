const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', protect, userController.searchUsers);
router.get('/friends', protect, userController.getFriendsData);
router.post('/friend-request', protect, userController.sendFriendRequest);
router.post('/friend-request/respond', protect, userController.respondFriendRequest);
router.get('/notifications', protect, userController.getNotifications);
router.put('/notifications/read', protect, userController.markNotificationsRead);
router.put('/profile', protect, userController.updateProfile);
router.get('/:identifier', protect, userController.getUserProfile);

module.exports = router;
