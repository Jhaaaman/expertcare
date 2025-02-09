import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '../../store/slices/bookingSlice';
import { validateForm } from '../../utils/validation';
import { showNotification } from '../../utils/notification';
import LoadingSpinner from '../common/LoadingSpinner';

const BookingModal = ({ service, isOpen, onClose }) => {
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.bookings);

  const validateField = (name, value) => {
    const validationError = validateForm.booking[name]?.(value) || '';
    setErrors(prev => ({
      ...prev,
      [name]: validationError
    }));
    return !validationError;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const validations = {
      date: validateField('date', bookingData.date),
      time: validateField('time', bookingData.time)
    };

    if (!Object.values(validations).every(Boolean)) {
      return;
    }

    try {
      await dispatch(createBooking({
        serviceId: service._id,
        ...bookingData
      })).unwrap();
      
      showNotification.success('Booking created successfully!');
      onClose();
    } catch (error) {
      showNotification.error(error.message || 'Failed to create booking');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Book Service</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              className={`w-full border rounded-md px-3 py-2 ${
                errors.date ? 'border-red-300' : 'border-gray-300'
              }`}
              value={bookingData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Time</label>
            <input
              type="time"
              name="time"
              className={`w-full border rounded-md px-3 py-2 ${
                errors.time ? 'border-red-300' : 'border-gray-300'
              }`}
              value={bookingData.time}
              onChange={handleChange}
              required
            />
            {errors.time && (
              <p className="mt-1 text-sm text-red-600">{errors.time}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              name="notes"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={bookingData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Processing...</span>
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal; 