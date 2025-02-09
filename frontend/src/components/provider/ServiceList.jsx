import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices, createService, updateService } from '../../store/slices/serviceSlice';
import { showNotification } from '../../utils/notification';
import LoadingSpinner from '../common/LoadingSpinner';
import ServiceModal from './ServiceModal';

const ServiceList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const dispatch = useDispatch();
  const { services, loading } = useSelector((state) => state.services);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleAddService = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleServiceSubmit = async (serviceData) => {
    try {
      if (selectedService) {
        await dispatch(updateService({
          id: selectedService._id,
          serviceData
        })).unwrap();
        showNotification.success('Service updated successfully');
      } else {
        await dispatch(createService(serviceData)).unwrap();
        showNotification.success('Service created successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      showNotification.error(error.message || 'Failed to save service');
    }
  };

  const providerServices = services.filter(service => service.provider === user?.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">My Services</h2>
        <button
          onClick={handleAddService}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
        >
          Add New Service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : providerServices.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">You haven't added any services yet.</p>
          <button
            onClick={handleAddService}
            className="mt-4 text-primary hover:text-primary-dark"
          >
            Add your first service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providerServices.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {service.images?.[0] && (
                <img
                  src={service.images[0]}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-semibold">
                    ${service.price}
                  </span>
                  <button
                    onClick={() => handleEditService(service)}
                    className="text-gray-600 hover:text-primary"
                  >
                    Edit
                  </button>
                </div>
                <div className="mt-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    service.isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ServiceModal
          service={selectedService}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleServiceSubmit}
        />
      )}
    </div>
  );
};

export default ServiceList; 