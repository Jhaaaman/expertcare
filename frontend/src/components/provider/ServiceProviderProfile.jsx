import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProviderProfile } from '../../store/slices/providerSlice';
import { showNotification } from '../../utils/notification';
import { validateForm } from '../../utils/validation';
import LoadingSpinner from '../common/LoadingSpinner';

const ServiceProviderProfile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: user?.businessName || '',
    description: user?.description || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    businessHours: user?.businessHours || {
      monday: { start: '09:00', end: '17:00', isOpen: true },
      tuesday: { start: '09:00', end: '17:00', isOpen: true },
      wednesday: { start: '09:00', end: '17:00', isOpen: true },
      thursday: { start: '09:00', end: '17:00', isOpen: true },
      friday: { start: '09:00', end: '17:00', isOpen: true },
      saturday: { start: '10:00', end: '15:00', isOpen: false },
      sunday: { start: '10:00', end: '15:00', isOpen: false },
    },
    categories: user?.categories || [],
    qualifications: user?.qualifications || [],
    profileImage: user?.profileImage || '',
    insurance: user?.insurance || {
      hasInsurance: false,
      policyNumber: '',
      expiryDate: '',
    }
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const availableCategories = [
    'Cleaning',
    'Maintenance',
    'Repair',
    'Landscaping',
    'Plumbing',
    'Electrical',
    'Painting',
    'Moving',
    'Other'
  ];

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
      case 'businessName':
        if (!value.trim()) validationError = 'Business name is required';
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
      if (name.includes('businessHours')) {
        const [day, field] = name.split('.');
        setFormData(prev => ({
          ...prev,
          businessHours: {
            ...prev.businessHours,
            [day]: {
              ...prev.businessHours[day],
              [field]: checked
            }
          }
        }));
      } else if (name === 'hasInsurance') {
        setFormData(prev => ({
          ...prev,
          insurance: {
            ...prev.insurance,
            hasInsurance: checked
          }
        }));
      }
    } else {
      if (name.includes('businessHours')) {
        const [day, field] = name.split('.');
        setFormData(prev => ({
          ...prev,
          businessHours: {
            ...prev.businessHours,
            [day]: {
              ...prev.businessHours[day],
              [field]: value
            }
          }
        }));
      } else if (name.includes('insurance.')) {
        const field = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          insurance: {
            ...prev.insurance,
            [field]: value
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
        validateField(name, value);
      }
    }
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleQualificationAdd = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, { title: '', issuer: '', year: '' }]
    }));
  };

  const handleQualificationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleQualificationRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const validations = {
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      businessName: validateField('businessName', formData.businessName)
    };

    if (!Object.values(validations).every(Boolean)) {
      return;
    }

    try {
      await dispatch(updateProviderProfile(formData)).unwrap();
      showNotification.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      showNotification.error(error.message || 'Failed to update profile');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Provider Profile</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-primary hover:text-primary-dark"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name*
                </label>
                <input
                  type="text"
                  name="businessName"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100 ${
                    errors.businessName ? 'border-red-300' : ''
                  }`}
                  value={formData.businessName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email*
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
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description
              </label>
              <textarea
                name="description"
                rows="4"
                className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100"
                value={formData.description}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Categories
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableCategories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={category}
                      checked={formData.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor={category} className="ml-2 text-sm text-gray-700">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Business Hours</h3>
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(formData.businessHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-24">
                      <span className="text-sm font-medium text-gray-700">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      name={`businessHours.${day}.isOpen`}
                      checked={hours.isOpen}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <input
                      type="time"
                      name={`businessHours.${day}.start`}
                      value={hours.start}
                      onChange={handleChange}
                      disabled={!isEditing || !hours.isOpen}
                      className="px-2 py-1 border rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      name={`businessHours.${day}.end`}
                      value={hours.end}
                      onChange={handleChange}
                      disabled={!isEditing || !hours.isOpen}
                      className="px-2 py-1 border rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Qualifications */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Qualifications</h3>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleQualificationAdd}
                    className="text-primary hover:text-primary-dark"
                  >
                    Add Qualification
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {formData.qualifications.map((qual, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder="Qualification Title"
                      value={qual.title}
                      onChange={(e) => handleQualificationChange(index, 'title', e.target.value)}
                      disabled={!isEditing}
                      className="flex-1 px-3 py-2 border rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100"
                    />
                    <input
                      type="text"
                      placeholder="Issuer"
                      value={qual.issuer}
                      onChange={(e) => handleQualificationChange(index, 'issuer', e.target.value)}
                      disabled={!isEditing}
                      className="flex-1 px-3 py-2 border rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100"
                    />
                    <input
                      type="number"
                      placeholder="Year"
                      value={qual.year}
                      onChange={(e) => handleQualificationChange(index, 'year', e.target.value)}
                      disabled={!isEditing}
                      className="w-24 px-3 py-2 border rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100"
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleQualificationRemove(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Insurance Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Insurance Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasInsurance"
                    id="hasInsurance"
                    checked={formData.insurance.hasInsurance}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="hasInsurance" className="ml-2 text-sm text-gray-700">
                    I have business insurance
                  </label>
                </div>
                {formData.insurance.hasInsurance && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Policy Number
                      </label>
                      <input
                        type="text"
                        name="insurance.policyNumber"
                        value={formData.insurance.policyNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        name="insurance.expiryDate"
                        value={formData.insurance.expiryDate}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4">
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

export default ServiceProviderProfile; 