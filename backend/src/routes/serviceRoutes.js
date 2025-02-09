const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const serviceController = require('../controllers/serviceController');

router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getService);
router.post('/', auth, authorize('provider'), serviceController.createService);
router.put('/:id', auth, authorize('provider'), serviceController.updateService);
router.delete('/:id', auth, authorize('provider'), serviceController.deleteService);
router.get('/provider/services', auth, authorize('provider'), serviceController.getProviderServices);

module.exports = router; 