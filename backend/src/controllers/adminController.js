const User = require('../models/User');
const Booking = require('../models/Booking');
const Transaction = require('../models/Transaction');

const adminController = {
  getDashboardStats: async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalProviders = await User.countDocuments({ role: 'provider' });
      const totalBookings = await Booking.countDocuments();
      const totalRevenue = await Transaction.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      res.json({
        totalUsers,
        totalProviders,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllBookings: async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate('customer', 'name email')
        .populate('provider', 'name email')
        .populate('service');
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllTransactions: async (req, res) => {
    try {
      const transactions = await Transaction.find()
        .populate({
          path: 'booking',
          populate: [
            { path: 'customer', select: 'name email' },
            { path: 'provider', select: 'name email' },
            { path: 'service' }
          ]
        });
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateUserStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = adminController; 