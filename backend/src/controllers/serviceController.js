const Service = require('../models/Service');

const serviceController = {
  // Get all services
  getAllServices: async (req, res) => {
    try {
      const services = await Service.find().populate('provider', 'name email');
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single service
  getService: async (req, res) => {
    try {
      const service = await Service.findById(req.params.id).populate('provider');
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create service
  createService: async (req, res) => {
    try {
      const service = new Service({
        ...req.body,
        provider: req.user.id
      });
      await service.save();
      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update service
  updateService: async (req, res) => {
    try {
      const service = await Service.findOne({ 
        _id: req.params.id,
        provider: req.user.id 
      });
      
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }

      Object.assign(service, req.body);
      await service.save();
      res.json(service);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete service
  deleteService: async (req, res) => {
    try {
      const service = await Service.findOneAndDelete({
        _id: req.params.id,
        provider: req.user.id
      });
      
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      
      res.json({ message: 'Service deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get provider's services
  getProviderServices: async (req, res) => {
    try {
      const services = await Service.find({ provider: req.user.id });
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = serviceController; 