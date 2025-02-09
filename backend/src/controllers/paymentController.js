const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');

// Check if Stripe key is configured
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Warning: Stripe secret key is not configured in environment variables');
}

const paymentController = {
  createPaymentIntent: async (req, res) => {
    try {
      const { bookingId } = req.body;
      const booking = await Booking.findById(bookingId).populate('service');

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: booking.service.price * 100, // Stripe expects amounts in cents
        currency: 'usd',
        metadata: {
          bookingId: booking._id.toString()
        }
      });

      res.json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      console.error('Stripe error:', error);
      res.status(500).json({ message: 'Payment processing error', error: error.message });
    }
  },

  confirmPayment: async (req, res) => {
    try {
      const { bookingId, paymentIntentId } = req.body;
      const booking = await Booking.findById(bookingId).populate('service');

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      const transaction = new Transaction({
        booking: bookingId,
        amount: booking.service.price,
        status: 'paid',
        paymentMethod: 'credit_card',
        paymentDetails: {
          transactionId: paymentIntentId,
          paymentDate: new Date()
        }
      });

      await transaction.save();

      // Update booking status
      await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed' });

      res.json({ transaction });
    } catch (error) {
      console.error('Payment confirmation error:', error);
      res.status(500).json({ message: 'Payment confirmation error', error: error.message });
    }
  },

  getTransaction: async (req, res) => {
    try {
      const transaction = await Transaction.findById(req.params.id)
        .populate('booking');
      
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = paymentController; 