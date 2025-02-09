export const validateForm = {
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!regex.test(email)) return 'Invalid email format';
    return '';
  },

  password: (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  },

  service: {
    name: (name) => {
      if (!name) return 'Service name is required';
      if (name.length < 3) return 'Service name must be at least 3 characters';
      return '';
    },
    price: (price) => {
      if (!price) return 'Price is required';
      if (isNaN(price) || price <= 0) return 'Price must be a positive number';
      return '';
    }
  },

  booking: {
    date: (date) => {
      if (!date) return 'Date is required';
      const selectedDate = new Date(date);
      const today = new Date();
      if (selectedDate < today) return 'Date cannot be in the past';
      return '';
    },
    time: (time) => {
      if (!time) return 'Time is required';
      return '';
    }
  }
}; 