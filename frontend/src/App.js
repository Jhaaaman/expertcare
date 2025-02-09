import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './store/store';
import { fetchCurrentUser } from './store/slices/authSlice';
import PrivateRoute from './components/common/PrivateRoute';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/common/ErrorBoundary';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CustomerDashboard from './components/customer/Dashboard';
import ProviderDashboard from './components/provider/Dashboard';
import AdminDashboard from './components/admin/Dashboard';
import Navbar from './components/common/Navbar';
import Home from './components/common/Home';
import Unauthorized from './components/common/Unauthorized';
import NotFound from './components/common/NotFound';

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Customer Routes */}
            <Route
              path="/customer/*"
              element={
                <PrivateRoute roles={['customer']}>
                  <CustomerDashboard />
                </PrivateRoute>
              }
            />
            
            {/* Provider Routes */}
            <Route
              path="/provider/*"
              element={
                <PrivateRoute roles={['provider']}>
                  <ProviderDashboard />
                </PrivateRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={5000} />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App; 