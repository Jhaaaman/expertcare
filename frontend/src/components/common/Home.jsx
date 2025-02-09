import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const features = [
    {
      title: 'Expert Service Providers',
      description: 'Connect with verified professionals for quality home services',
      icon: '👨‍🔧'
    },
    {
      title: 'Secure Bookings',
      description: 'Easy scheduling and secure payment processing',
      icon: '🔒'
    },
    {
      title: 'Real-time Updates',
      description: 'Track your service status and get instant notifications',
      icon: '📱'
    },
    {
      title: 'Quality Guaranteed',
      description: 'Satisfaction guaranteed with our service quality promise',
      icon: '⭐'
    }
  ];

  const services = [
    {
      name: 'Home Cleaning',
      icon: '🧹',
      description: 'Professional home cleaning services'
    },
    {
      name: 'Plumbing',
      icon: '🔧',
      description: 'Expert plumbing repair and installation'
    },
    {
      name: 'Electrical',
      icon: '⚡',
      description: 'Electrical repairs and maintenance'
    },
    {
      name: 'Landscaping',
      icon: '🌿',
      description: 'Garden design and maintenance'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Expert Care for Your Home
              </h1>
              <p className="text-xl mb-8">
                Connect with trusted service providers for all your home maintenance needs
              </p>
              {!isAuthenticated && (
                <div className="space-x-4">
                  <Link
                    to="/register"
                    className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition duration-300"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
            <div className="md:w-1/2">
              <img
                src="/images/hero-image.png"
                alt="Home Services"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ExpertCare?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-center"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
                <Link
                  to={`/services/${service.name.toLowerCase().replace(' ', '-')}`}
                  className="mt-4 inline-block text-primary hover:text-primary-dark font-medium"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Join thousands of satisfied customers who trust ExpertCare
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
            >
              Sign Up Now
            </Link>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">John Doe</h4>
                    <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Excellent service! The provider was professional, punctual, and did a great job.
                  Would definitely recommend ExpertCare to others."
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ExpertCare</h3>
              <p className="text-gray-400">
                Your trusted platform for professional home services
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-white">Services</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                {services.map((service, index) => (
                  <li key={index}>
                    <Link to={`/services/${service.name.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-white">
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@expertcare.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Address: 123 Service St, City, State</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ExpertCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 