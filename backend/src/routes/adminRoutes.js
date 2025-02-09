const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.get('/dashboard', auth, authorize('admin'), adminController.getDashboardStats);
router.get('/users', auth, authorize('admin'), adminController.getAllUsers);
router.get('/bookings', auth, authorize('admin'), adminController.getAllBookings);
router.get('/transactions', auth, authorize('admin'), adminController.getAllTransactions);
router.put('/user/:id/status', auth, authorize('admin'), adminController.updateUserStatus);

module.exports = router; 