import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminStats } from '../../store/slices/adminSlice';
import UsersList from './UsersList';
import BookingsList from './BookingsList';
import TransactionsList from './TransactionsList';
import StatsCards from './StatsCards';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const tabs = [
    { name: 'Overview', value: 'stats' },
    { name: 'Users', value: 'users' },
    { name: 'Bookings', value: 'bookings' },
    { name: 'Transactions', value: 'transactions' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Monitor and manage platform activities</p>
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
        {activeTab === 'stats' && <StatsCards stats={stats} loading={loading} />}
        {activeTab === 'users' && <UsersList />}
        {activeTab === 'bookings' && <BookingsList />}
        {activeTab === 'transactions' && <TransactionsList />}
      </div>
    </div>
  );
};

export default AdminDashboard; 