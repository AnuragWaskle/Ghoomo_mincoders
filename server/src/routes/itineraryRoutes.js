const express = require('express');
const itineraryController = require('../controllers/itineraryController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Generate a new itinerary
router.post('/', itineraryController.generateItinerary);

// Get all itineraries for the current user
router.get('/', itineraryController.getUserItineraries);

// Get an itinerary by ID
router.get('/:itineraryId', itineraryController.getItinerary);

// Update an itinerary
router.put('/:itineraryId', itineraryController.updateItinerary);

// Delete an itinerary
router.delete('/:itineraryId', itineraryController.deleteItinerary);

// Transport pricing routes
router.post('/transport/calculate', itineraryController.calculateTransportPrice);
router.get('/transport/:city/:budgetLevel?', itineraryController.getTransportOptions);

module.exports = router;