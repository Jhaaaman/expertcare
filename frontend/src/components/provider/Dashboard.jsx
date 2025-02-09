import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProviderBookings } from '../../store/slices/bookingSlice';
import BookingList from './BookingList';
import ServiceList from './ServiceList';
import Stats from './Stats';

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { bookings, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchProviderBookings());
  }, [dispatch]);

  const tabs = [
    { name: 'Bookings', value: 'bookings' },
    { name: 'Services', value: 'services' },
    { name: 'Stats', value: 'stats' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your services and bookings</p>
      </div>

      <div className="mb-8">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === tab.value
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'bookings' && <BookingList bookings={bookings} loading={loading} />}
        {activeTab === 'services' && <ServiceList />}
        {activeTab === 'stats' && <Stats />}
      </div>
    </div>
  );
};

export default ProviderDashboard; 