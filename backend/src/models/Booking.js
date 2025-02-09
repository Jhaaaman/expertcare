const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'canceled'],
    default: 'pending'
  },
  notes: String,
  scheduledTime: {
    startTime: String,
    endTime: String
  },
  cancellationReason: String,
  customerFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema); 