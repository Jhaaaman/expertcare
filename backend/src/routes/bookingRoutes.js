const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');

router.post('/', auth, authorize('customer'), bookingController.createBooking);
router.get('/my-bookings', auth, bookingController.getMyBookings);
router.put('/:id/status', auth, authorize('provider'), bookingController.updateBookingStatus);
router.get('/:id', auth, bookingController.getBooking);
router.post('/:id/feedback', auth, authorize('customer'), bookingController.addFeedback);

module.exports = router; 