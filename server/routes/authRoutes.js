const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, authController.register);
router.post('/google', authLimiter, authController.googleLogin);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password/:token', authLimiter, authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/send-otp', protect, authController.sendVerificationOtp);
router.post('/verify-otp', protect, authController.verifyOtp);
router.get('/me', protect, authController.getMe);

module.exports = router;
