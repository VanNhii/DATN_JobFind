const express = require("express");
// Import các controller từ authController.js
const { register, login, verifyOTP, resendOTP, resetPassword, forgotPassword, getMe, updateDetails, updatePassword, logout } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Router cho đăng ký người dùng
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post('/resend-otp', resendOTP);
router.post("/login", login);
router.get('/logout', logout);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;