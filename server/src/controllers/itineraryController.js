const itineraryService = require('../services/itineraryService');
const transportService = require('../services/transportService');
const { db } = require('../config/firebase');

/**
 * Generate a new itinerary
 */
exports.generateItinerary = async (req, res, next) => {
  try {
    const { destination, startDate, endDate, budget, preferences } = req.body;
    const userId = req.user.uid;
    
    // Validate required fields
    if (!destination || !startDate || !endDate || !budget) {
      return res.status(400).json({
        message: 'Missing required fields: destination, startDate, endDate, and budget are required'
      });
    }
    
    // Get user's travel persona from their profile
    const userDoc = await db.collection('users').doc(userId).get();
    const travelPersona = userDoc.data()?.travelPersona || 'default';
    
    // Generate the itinerary
    const itinerary = await itineraryService.generateItinerary(
      {
        destination,
        startDate,
        endDate,
        budget,
        travelPersona,
        preferences
      },
      userId
    );
    
    // Get transport budget for the destination
    const transportBudget = transportService.getDailyTransportBudget(
      destination.split(',')[0], // Extract city name
      budget
    );
    
    // Add transport budget to the response
    itinerary.transportBudget = transportBudget;
    
    return res.status(201).json({
      message: 'Itinerary generated successfully',
      itinerary
    });
  } catch (error) {
    console.error('Error in generateItinerary:', error);
    next(error);
  }
};

/**
 * Get an itinerary by ID
 */
exports.getItinerary = async (req, res, next) => {
  try {
    const { itineraryId } = req.params;
    const userId = req.user.uid;
    
    const itinerary = await itineraryService.getItineraryById(itineraryId, userId);
    
    return res.status(200).json({
      itinerary
    });
  } catch (error) {
    console.error('Error in getItinerary:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({ message: 'Unauthorized access to itinerary' });
    }
    
    next(error);
  }
};

/**
 * Get all itineraries for the current user
 */
exports.getUserItineraries = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    
    const itineraries = await itineraryService.getUserItineraries(userId);
    
    return res.status(200).json({
      count: itineraries.length,
      itineraries
    });
  } catch (error) {
    console.error('Error in getUserItineraries:', error);
    next(error);
  }
};

/**
 * Update an itinerary
 */
exports.updateItinerary = async (req, res, next) => {
  try {
    const { itineraryId } = req.params;
    const updates = req.body;
    const userId = req.user.uid;
    
    // Prevent updating critical fields
    delete updates.id;
    delete updates.userId;
    delete updates.createdAt;
    
    const updatedItinerary = await itineraryService.updateItinerary(
      itineraryId,
      updates,
      userId
    );
    
    return res.status(200).json({
      message: 'Itinerary updated successfully',
      itinerary: updatedItinerary
    });
  } catch (error) {
    console.error('Error in updateItinerary:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({ message: 'Unauthorized access to itinerary' });
    }
    
    next(error);
  }
};

/**
 * Delete an itinerary
 */
exports.deleteItinerary = async (req, res, next) => {
  try {
    const { itineraryId } = req.params;
    const userId = req.user.uid;
    
    await itineraryService.deleteItinerary(itineraryId, userId);
    
    return res.status(200).json({
      message: 'Itinerary deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteItinerary:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({ message: 'Unauthorized access to itinerary' });
    }
    
    next(error);
  }
};

/**
 * Calculate transport price
 */
exports.calculateTransportPrice = async (req, res, next) => {
  try {
    const { transportType, distance, city, time, waitingTime } = req.body;
    
    if (!transportType || !distance || !city) {
      return res.status(400).json({
        message: 'Missing required fields: transportType, distance, and city are required'
      });
    }
    
    const priceDetails = transportService.calculateFairPrice({
      transportType,
      distance,
      city,
      time,
      waitingTime
    });
    
    return res.status(200).json({
      priceDetails
    });
  } catch (error) {
    console.error('Error in calculateTransportPrice:', error);
    next(error);
  }
};

/**
 * Get transport options for a city
 */
exports.getTransportOptions = async (req, res, next) => {
  try {
    const { city, budgetLevel } = req.params;
    
    if (!city) {
      return res.status(400).json({
        message: 'City is required'
      });
    }
    
    const transportBudget = transportService.getDailyTransportBudget(city, budgetLevel);
    
    return res.status(200).json({
      transportBudget
    });
  } catch (error) {
    console.error('Error in getTransportOptions:', error);
    next(error);
  }
};