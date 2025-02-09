const config = {
  // API Configuration
  apiUrl: process.env.REACT_APP_API_URL,
  socketUrl: process.env.REACT_APP_SOCKET_URL,
  
  // Authentication
  jwtExpiry: process.env.REACT_APP_JWT_EXPIRY,
  
  // Feature Flags
  features: {
    notifications: process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true',
    chat: process.env.REACT_APP_ENABLE_CHAT === 'true',
  },
  
  // External Services
  stripe: {
    publicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
  },
  
  google: {
    mapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  },
  
  // App Info
  appName: process.env.REACT_APP_APP_NAME,
  supportEmail: process.env.REACT_APP_SUPPORT_EMAIL,
  
  // Validation
  validation: {
    passwordMinLength: 8,
    phoneRegex: /^\+?[\d\s-]{10,}$/,
    nameMaxLength: 50,
  },
  
  // API Endpoints
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refreshToken: '/auth/refresh-token',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
    },
    users: {
      profile: '/users/profile',
      updateProfile: '/users/profile',
      changePassword: '/users/change-password',
    },
    services: {
      list: '/services',
      create: '/services',
      update: '/services/:id',
      delete: '/services/:id',
    },
    bookings: {
      create: '/bookings',
      list: '/bookings',
      update: '/bookings/:id',
      cancel: '/bookings/:id/cancel',
    },
    payments: {
      create: '/payments',
      list: '/payments',
      refund: '/payments/:id/refund',
    },
  },
};

export default config; 