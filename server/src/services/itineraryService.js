const openTripMapService = require('./openTripMapService');
const weatherService = require('./weatherService');
const { db } = require('../config/firebase');
const axios = require('axios');
const config = require('../config/env');

/**
 * Generate an itinerary for a destination
 * @param {Object} params - Itinerary parameters
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Generated itinerary
 */
const generateItinerary = async (params, userId) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      budget,
      travelPersona,
      preferences = {}
    } = params;
    
    // Search for the destination
    const destinationData = await openTripMapService.searchDestination(destination);
    
    if (!destinationData) {
      throw new Error('Destination not found');
    }
    
    const { lat, lon, name, country } = destinationData;
    
    // Get categorized places near the destination
    const places = await openTripMapService.getCategorizedPlaces(lat, lon);
    
    // Get weather forecast
    const weather = await weatherService.getWeatherForecast(lat, lon);
    
    // Calculate trip duration in days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const tripDuration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    // Generate daily itineraries
    const dailyItineraries = await generateDailyItineraries(
      places,
      tripDuration,
      budget,
      travelPersona,
      preferences,
      weather,
      start
    );
    
    // Create the itinerary object
    const itinerary = {
      id: generateItineraryId(),
      userId,
      destination: {
        name,
        country,
        lat,
        lon
      },
      startDate,
      endDate,
      budget,
      travelPersona,
      preferences,
      dailyItineraries,
      weather: weather.dailyForecasts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save the itinerary to Firestore
    await saveItinerary(itinerary);
    
    return itinerary;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw new Error(`Failed to generate itinerary: ${error.message}`);
  }
};

/**
 * Generate daily itineraries
 * @param {Object} places - Categorized places
 * @param {number} days - Number of days
 * @param {string} budget - Budget level
 * @param {string} travelPersona - Travel persona
 * @param {Object} preferences - User preferences
 * @param {Object} weather - Weather forecast
 * @param {Date} startDate - Start date
 * @returns {Promise<Array>} - Daily itineraries
 */
const generateDailyItineraries = async (
  places,
  days,
  budget,
  travelPersona,
  preferences,
  weather,
  startDate
) => {
  // Define budget ranges (in USD)
  const budgetRanges = {
    low: { daily: 50, accommodation: 20, meal: 10, activity: 15, transport: 5 },
    medium: { daily: 150, accommodation: 60, meal: 25, activity: 40, transport: 25 },
    high: { daily: 300, accommodation: 150, meal: 50, activity: 70, transport: 30 }
  };
  
  // Map user budget to budget range
  const budgetLevel = budget === 'low' ? 'low' : budget === 'high' ? 'high' : 'medium';
  const budgetRange = budgetRanges[budgetLevel];
  
  // Distribute places across days based on travel persona
  const distributedPlaces = distributePlacesByPersona(places, days, travelPersona, preferences);
  
  // Generate daily itineraries
  const dailyItineraries = [];
  
  for (let day = 0; day < days; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);
    const dateString = currentDate.toISOString().split('T')[0];
    
    // Get weather for the day
    const dayWeather = weather.dailyForecasts.find(forecast => forecast.date === dateString) || null;
    
    // Adjust activities based on weather
    const adjustedActivities = adjustActivitiesForWeather(distributedPlaces[day], dayWeather);
    
    // Generate time slots
    const timeSlots = generateTimeSlots(adjustedActivities, budgetRange);
    
    // Calculate daily costs
    const dailyCost = calculateDailyCost(timeSlots, budgetRange);
    
    dailyItineraries.push({
      day: day + 1,
      date: dateString,
      weather: dayWeather,
      timeSlots,
      dailyCost
    });
  }
  
  return dailyItineraries;
};

/**
 * Distribute places across days based on travel persona
 * @param {Object} places - Categorized places
 * @param {number} days - Number of days
 * @param {string} travelPersona - Travel persona
 * @param {Object} preferences - User preferences
 * @returns {Array} - Distributed places for each day
 */
const distributePlacesByPersona = (places, days, travelPersona, preferences) => {
  // Define weights for different place types based on travel persona
  const personaWeights = {
    foodie: {
      cultural: 0.2,
      natural: 0.1,
      entertainment: 0.1,
      shopping: 0.1,
      religious: 0.1,
      restaurants: 0.4
    },
    adventurer: {
      cultural: 0.1,
      natural: 0.4,
      entertainment: 0.3,
      shopping: 0.1,
      religious: 0.05,
      restaurants: 0.05
    },
    culturalExplorer: {
      cultural: 0.4,
      natural: 0.1,
      entertainment: 0.1,
      shopping: 0.1,
      religious: 0.2,
      restaurants: 0.1
    },
    relaxer: {
      cultural: 0.1,
      natural: 0.3,
      entertainment: 0.2,
      shopping: 0.2,
      religious: 0.05,
      restaurants: 0.15
    },
    shopaholic: {
      cultural: 0.1,
      natural: 0.05,
      entertainment: 0.15,
      shopping: 0.5,
      religious: 0.05,
      restaurants: 0.15
    },
    // Default balanced weights
    default: {
      cultural: 0.25,
      natural: 0.2,
      entertainment: 0.15,
      shopping: 0.15,
      religious: 0.1,
      restaurants: 0.15
    }
  };
  
  // Get weights for the travel persona
  const weights = personaWeights[travelPersona] || personaWeights.default;
  
  // Apply user preferences to adjust weights if needed
  if (preferences.interests) {
    // Adjust weights based on interests (implementation depends on how interests are structured)
  }
  
  // Distribute places across days
  const distributedPlaces = [];
  
  // Track used places to avoid duplicates
  const usedPlaceIds = new Set();
  
  for (let day = 0; day < days; day++) {
    const dayPlaces = {
      morning: [],
      afternoon: [],
      evening: []
    };
    
    // Morning: Prioritize cultural and religious sites
    dayPlaces.morning = selectPlaces(
      [...places.cultural, ...places.religious],
      2,
      usedPlaceIds
    );
    
    // Afternoon: Mix of natural, entertainment, and shopping
    dayPlaces.afternoon = selectPlaces(
      [...places.natural, ...places.entertainment, ...places.shopping],
      2,
      usedPlaceIds
    );
    
    // Evening: Restaurants and entertainment
    dayPlaces.evening = selectPlaces(
      [...places.restaurants, ...places.entertainment],
      2,
      usedPlaceIds
    );
    
    distributedPlaces.push(dayPlaces);
  }
  
  return distributedPlaces;
};

/**
 * Select places without duplicates
 * @param {Array} places - List of places
 * @param {number} count - Number of places to select
 * @param {Set} usedPlaceIds - Set of used place IDs
 * @returns {Array} - Selected places
 */
const selectPlaces = (places, count, usedPlaceIds) => {
  const selected = [];
  const shuffled = [...places].sort(() => 0.5 - Math.random());
  
  for (const place of shuffled) {
    if (selected.length >= count) break;
    
    if (!usedPlaceIds.has(place.xid)) {
      selected.push(place);
      usedPlaceIds.add(place.xid);
    }
  }
  
  return selected;
};

/**
 * Adjust activities based on weather
 * @param {Object} dayPlaces - Places for the day
 * @param {Object} weather - Weather forecast
 * @returns {Object} - Adjusted activities
 */
const adjustActivitiesForWeather = (dayPlaces, weather) => {
  // If no weather data or good weather, return original activities
  if (!weather || weather.weatherDescription.includes('clear')) {
    return dayPlaces;
  }
  
  const adjustedPlaces = { ...dayPlaces };
  
  // If rainy, replace outdoor activities with indoor ones
  if (
    weather.weatherDescription.includes('rain') ||
    weather.weatherDescription.includes('storm')
  ) {
    // Replace natural places with more cultural/indoor options
    // This is a simplified implementation
  }
  
  return adjustedPlaces;
};

/**
 * Generate time slots for a day
 * @param {Object} dayPlaces - Places for the day
 * @param {Object} budgetRange - Budget range
 * @returns {Array} - Time slots
 */
const generateTimeSlots = (dayPlaces, budgetRange) => {
  const timeSlots = [];
  
  // Morning activities (9 AM - 12 PM)
  timeSlots.push({
    startTime: '09:00',
    endTime: '10:30',
    activity: {
      type: 'attraction',
      ...dayPlaces.morning[0],
      estimatedCost: Math.floor(Math.random() * budgetRange.activity)
    }
  });
  
  timeSlots.push({
    startTime: '11:00',
    endTime: '12:30',
    activity: {
      type: 'attraction',
      ...dayPlaces.morning[1],
      estimatedCost: Math.floor(Math.random() * budgetRange.activity)
    }
  });
  
  // Lunch (12:30 PM - 2 PM)
  timeSlots.push({
    startTime: '12:30',
    endTime: '14:00',
    activity: {
      type: 'meal',
      name: 'Lunch',
      description: 'Enjoy a local lunch',
      estimatedCost: budgetRange.meal
    }
  });
  
  // Afternoon activities (2 PM - 6 PM)
  timeSlots.push({
    startTime: '14:00',
    endTime: '15:30',
    activity: {
      type: 'attraction',
      ...dayPlaces.afternoon[0],
      estimatedCost: Math.floor(Math.random() * budgetRange.activity)
    }
  });
  
  timeSlots.push({
    startTime: '16:00',
    endTime: '18:00',
    activity: {
      type: 'attraction',
      ...dayPlaces.afternoon[1],
      estimatedCost: Math.floor(Math.random() * budgetRange.activity)
    }
  });
  
  // Dinner (6:30 PM - 8 PM)
  timeSlots.push({
    startTime: '18:30',
    endTime: '20:00',
    activity: {
      type: 'meal',
      name: 'Dinner',
      description: 'Enjoy dinner at a local restaurant',
      estimatedCost: budgetRange.meal * 1.5
    }
  });
  
  // Evening activity (8 PM - 10 PM)
  timeSlots.push({
    startTime: '20:00',
    endTime: '22:00',
    activity: {
      type: 'attraction',
      ...dayPlaces.evening[0],
      estimatedCost: Math.floor(Math.random() * budgetRange.activity)
    }
  });
  
  return timeSlots;
};

/**
 * Calculate daily cost
 * @param {Array} timeSlots - Time slots
 * @param {Object} budgetRange - Budget range
 * @returns {Object} - Daily cost breakdown
 */
const calculateDailyCost = (timeSlots, budgetRange) => {
  const costs = {
    activities: 0,
    meals: 0,
    transport: budgetRange.transport,
    accommodation: budgetRange.accommodation,
    total: 0
  };
  
  timeSlots.forEach(slot => {
    if (slot.activity.type === 'meal') {
      costs.meals += slot.activity.estimatedCost;
    } else {
      costs.activities += slot.activity.estimatedCost;
    }
  });
  
  costs.total = costs.activities + costs.meals + costs.transport + costs.accommodation;
  
  return costs;
};

/**
 * Generate a unique itinerary ID
 * @returns {string} - Unique ID
 */
const generateItineraryId = () => {
  return 'itin_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
};

/**
 * Save itinerary to Firestore
 * @param {Object} itinerary - Itinerary object
 * @returns {Promise<void>}
 */
const saveItinerary = async (itinerary) => {
  try {
    await db.collection('itineraries').doc(itinerary.id).set(itinerary);
  } catch (error) {
    console.error('Error saving itinerary:', error);
    throw new Error('Failed to save itinerary');
  }
};

/**
 * Get itinerary by ID
 * @param {string} itineraryId - Itinerary ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Itinerary object
 */
const getItineraryById = async (itineraryId, userId) => {
  try {
    const doc = await db.collection('itineraries').doc(itineraryId).get();
    
    if (!doc.exists) {
      throw new Error('Itinerary not found');
    }
    
    const itinerary = doc.data();
    
    // Check if the itinerary belongs to the user
    if (itinerary.userId !== userId) {
      throw new Error('Unauthorized access to itinerary');
    }
    
    return itinerary;
  } catch (error) {
    console.error('Error getting itinerary:', error);
    throw new Error(`Failed to get itinerary: ${error.message}`);
  }
};

/**
 * Get all itineraries for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - List of itineraries
 */
const getUserItineraries = async (userId) => {
  try {
    const snapshot = await db
      .collection('itineraries')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting user itineraries:', error);
    throw new Error('Failed to get user itineraries');
  }
};

/**
 * Update an itinerary
 * @param {string} itineraryId - Itinerary ID
 * @param {Object} updates - Updates to apply
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Updated itinerary
 */
const updateItinerary = async (itineraryId, updates, userId) => {
  try {
    // Get the current itinerary
    const itinerary = await getItineraryById(itineraryId, userId);
    
    // Apply updates
    const updatedItinerary = {
      ...itinerary,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Save the updated itinerary
    await db.collection('itineraries').doc(itineraryId).update(updatedItinerary);
    
    return updatedItinerary;
  } catch (error) {
    console.error('Error updating itinerary:', error);
    throw new Error(`Failed to update itinerary: ${error.message}`);
  }
};

/**
 * Delete an itinerary
 * @param {string} itineraryId - Itinerary ID
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
const deleteItinerary = async (itineraryId, userId) => {
  try {
    // Get the itinerary to verify ownership
    await getItineraryById(itineraryId, userId);
    
    // Delete the itinerary
    await db.collection('itineraries').doc(itineraryId).delete();
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    throw new Error(`Failed to delete itinerary: ${error.message}`);
  }
};

module.exports = {
  generateItinerary,
  getItineraryById,
  getUserItineraries,
  updateItinerary,
  deleteItinerary
};