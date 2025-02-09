import React from 'react';

const ServiceCard = ({ service, onBook }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {service.images?.[0] && (
        <img
          src={service.images[0]}
          alt={service.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
        <p className="mt-2 text-gray-600">{service.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-primary font-semibold">${service.price}</span>
          <button
            onClick={() => onBook(service)}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard; 