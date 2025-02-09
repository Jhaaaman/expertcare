import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProviderStats } from '../../store/slices/providerSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const Stats = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.provider);

  useEffect(() => {
    dispatch(fetchProviderStats());
  }, [dispatch]);

  const StatCard = ({ title, value, description, trend }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {trend && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Earnings"
          value={`$${stats?.totalEarnings || 0}`}
          description="Total earnings this month"
          trend={stats?.earningsTrend}
        />
        
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          description="Total bookings this month"
          trend={stats?.bookingsTrend}
        />
        
        <StatCard
          title="Completion Rate"
          value={`${stats?.completionRate || 0}%`}
          description="Service completion rate"
        />
        
        <StatCard
          title="Average Rating"
          value={stats?.averageRating?.toFixed(1) || 0}
          description={`From ${stats?.totalReviews || 0} reviews`}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          {stats?.recentActivity?.length > 0 ? (
            <ul className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <span className={`w-2 h-2 rounded-full ${
                    activity.type === 'booking' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></span>
                  <span className="text-sm text-gray-600">{activity.description}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent activity</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Services</h3>
          {stats?.popularServices?.length > 0 ? (
            <ul className="space-y-4">
              {stats.popularServices.map((service, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{service.name}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {service.bookings} bookings
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No services data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats; 