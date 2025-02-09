import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/slices/authSlice';
import { showNotification } from '../../utils/notification';
import { validateForm } from '../../utils/validation';
import LoadingSpinner from '../common/LoadingSpinner';

const CustomerProfile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    preferences: user?.preferences || {
      notifications: true,
      newsletter: false,
    }
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const validateField = (name, value) => {
    let validationError = '';
    switch (name) {
      case 'email':
        validationError = validateForm.email(value);
        break;
      case 'phone':
        if (value && !/^\+?[\d\s-]{10,}$/.test(value)) {
          validationError = 'Invalid phone number format';
        }
        break;
      default:
        break;
    }
    setErrors(prev => ({
      ...prev,
      [name]: validationError
    }));
    return !validationError;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      validateField(name, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const validations = {
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone)
    };

    if (!Object.values(validations).every(Boolean)) {
      return;
    }

    try {
      await dispatch(updateProfile(formData)).unwrap();
      showNotification.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      showNotification.error(error.message || 'Failed to update profile');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">My Profile</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-primary hover:text-primary-dark"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100 ${
                    errors.email ? 'border-red-300' : ''
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100 ${
                    errors.phone ? 'border-red-300' : ''
                  }`}
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifications"
                    id="notifications"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    checked={formData.preferences.notifications}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <label htmlFor="notifications" className="ml-2 text-sm text-gray-700">
                    Receive booking notifications
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="newsletter"
                    id="newsletter"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    checked={formData.preferences.newsletter}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
                    Subscribe to newsletter
                  </label>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
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
                      <span className="ml-2">Saving...</span>
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile; 