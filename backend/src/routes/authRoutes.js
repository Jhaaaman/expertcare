const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile } = require('../controllers/authController');
const { auth, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', auth, logout);
router.get('/profile', auth, getProfile);

// Protected route example
router.get('/admin-only', auth, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

module.exports = router; 