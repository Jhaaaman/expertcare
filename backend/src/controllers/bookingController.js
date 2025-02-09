const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');

const bookingController = {
  createBooking: async (req, res) => {
    try {
      const { serviceId, date, scheduledTime } = req.body;
      const service = await Service.findById(serviceId);
      
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }

      const booking = new Booking({
        customer: req.user.id,
        service: serviceId,
        provider: service.provider,
        date,
        scheduledTime
      });

      await booking.save();
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getMyBookings: async (req, res) => {
    try {
      let bookings;
      if (req.user.role === 'customer') {
        bookings = await Booking.find({ customer: req.user.id })
          .populate('service')
          .populate('provider', 'name email');
      } else if (req.user.role === 'provider') {
        bookings = await Booking.find({ provider: req.user.id })
          .populate('service')
          .populate('customer', 'name email');
      }
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateBookingStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const booking = await Booking.findOne({
        _id: req.params.id,
        provider: req.user.id
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      booking.status = status;
      await booking.save();
      res.json(booking);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getBooking: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate('service')
        .populate('provider', 'name email')
        .populate('customer', 'name email');

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check if user has permission to view this booking
      if (
        booking.customer.toString() !== req.user.id &&
        booking.provider.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addFeedback: async (req, res) => {
    try {
      const { rating, review } = req.body;
      const booking = await Booking.findOne({
        _id: req.params.id,
        customer: req.user.id,
        status: 'completed'
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found or not completed' });
      }

      booking.customerFeedback = { rating, review };
      await booking.save();

      // Update provider's average rating
      const provider = await User.findById(booking.provider);
      const providerRatings = provider.providerDetails.ratings;
      providerRatings.push({
        rating,
        review,
        customer: req.user.id
      });

      // Calculate new average rating
      const totalRatings = providerRatings.reduce((sum, item) => sum + item.rating, 0);
      provider.providerDetails.averageRating = totalRatings / providerRatings.length;
      await provider.save();

      res.json(booking);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = bookingController; 