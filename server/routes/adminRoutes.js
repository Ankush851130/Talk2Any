const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/stats', adminController.getAdminStats);
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/ban', adminController.toggleBanUser);
router.delete('/rooms/:roomId', adminController.adminDeleteRoom);
router.get('/reports', adminController.getReports);
router.put('/reports/:reportId', adminController.updateReportStatus);
router.get('/logs', adminController.getSystemLogs);

module.exports = router;
