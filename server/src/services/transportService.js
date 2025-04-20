/**
 * Transport pricing service
 * 
 * Note: This service uses simulated data for transport pricing.
 * In a production environment, you would integrate with real transport APIs.
 */

// Simulated base rates for different transport types (in INR)
const BASE_RATES = {
    rickshaw: {
      basePrice: 25,
      pricePerKm: 8,
      waitingChargePerMinute: 1
    },
    taxi: {
      basePrice: 50,
      pricePerKm: 15,
      waitingChargePerMinute: 2
    },
    uber: {
      basePrice: 45,
      pricePerKm: 12,
      waitingChargePerMinute: 1.5
    },
    bus: {
      basePrice: 10,
      pricePerKm: 2,
      waitingChargePerMinute: 0
    },
    metro: {
      basePrice: 10,
      pricePerKm: 2,
      waitingChargePerMinute: 0
    }
  };
  
  // City-specific price modifiers
  const CITY_MODIFIERS = {
    'Delhi': { rickshaw: 1.0, taxi: 1.0, uber: 1.0, bus: 1.0, metro: 1.0 },
    'Mumbai': { rickshaw: 1.2, taxi: 1.3, uber: 1.2, bus: 1.1, metro: 1.1 },
    'Bangalore': { rickshaw: 1.1, taxi: 1.2, uber: 1.1, bus: 1.0, metro: 1.0 },
    'Chennai': { rickshaw: 0.9, taxi: 1.0, uber: 1.0, bus: 0.9, metro: 0.9 },
    'Kolkata': { rickshaw: 0.8, taxi: 0.9, uber: 0.9, bus: 0.8, metro: 0.8 },
    'Jaipur': { rickshaw: 0.85, taxi: 0.95, uber: 0.9, bus: 0.85, metro: 0.0 },
    'Goa': { rickshaw: 1.3, taxi: 1.4, uber: 1.3, bus: 1.1, metro: 0.0 },
    'default': { rickshaw: 1.0, taxi: 1.0, uber: 1.0, bus: 1.0, metro: 1.0 }
  };
  
  // Time of day modifiers
  const TIME_MODIFIERS = {
    morning: 1.0,   // 6 AM - 10 AM
    day: 0.9,       // 10 AM - 4 PM
    evening: 1.2,   // 4 PM - 8 PM
    night: 1.5      // 8 PM - 6 AM
  };
  
  /**
   * Calculate fair price for transport
   * @param {Object} params - Transport parameters
   * @param {string} params.transportType - Type of transport (rickshaw, taxi, uber, bus, metro)
   * @param {number} params.distance - Distance in kilometers
   * @param {string} params.city - City name
   * @param {string} params.time - Time of day (HH:MM format)
   * @param {number} params.waitingTime - Waiting time in minutes (optional)
   * @returns {Object} - Price details
   */
  const calculateFairPrice = (params) => {
    const { transportType, distance, city, time, waitingTime = 0 } = params;
    
    // Get base rates for the transport type
    const baseRates = BASE_RATES[transportType] || BASE_RATES.rickshaw;
    
    // Get city modifier
    const cityModifiers = CITY_MODIFIERS[city] || CITY_MODIFIERS.default;
    const cityModifier = cityModifiers[transportType] || 1.0;
    
    // Get time modifier
    const timeModifier = getTimeModifier(time);
    
    // Calculate base price
    const basePrice = baseRates.basePrice * cityModifier;
    
    // Calculate distance price
    const distancePrice = distance * baseRates.pricePerKm * cityModifier;
    
    // Calculate waiting charge
    const waitingCharge = waitingTime * baseRates.waitingChargePerMinute;
    
    // Calculate total price
    const subtotal = basePrice + distancePrice + waitingCharge;
    const totalPrice = subtotal * timeModifier;
    
    // Round to nearest integer
    const roundedPrice = Math.round(totalPrice);
    
    return {
      transportType,
      basePrice: Math.round(basePrice),
      distancePrice: Math.round(distancePrice),
      waitingCharge: Math.round(waitingCharge),
      timeModifier,
      cityModifier,
      totalPrice: roundedPrice,
      currency: 'INR',
      priceRange: {
        low: Math.round(roundedPrice * 0.9),
        high: Math.round(roundedPrice * 1.1)
      }
    };
  };
  
  /**
   * Get time modifier based on time of day
   * @param {string} time - Time in HH:MM format
   * @returns {number} - Time modifier
   */
  const getTimeModifier = (time) => {
    if (!time) return TIME_MODIFIERS.day;
    
    const hour = parseInt(time.split(':')[0], 10);
    
    if (hour >= 6 && hour < 10) {
      return TIME_MODIFIERS.morning;
    } else if (hour >= 10 && hour < 16) {
      return TIME_MODIFIERS.day;
    } else if (hour >= 16 && hour < 20) {
      return TIME_MODIFIERS.evening;
    } else {
      return TIME_MODIFIERS.night;
    }
  };
  
  /**
   * Get available transport options for a city
   * @param {string} city - City name
   * @returns {Array} - Available transport options
   */
  const getAvailableTransport = (city) => {
    const cityModifiers = CITY_MODIFIERS[city] || CITY_MODIFIERS.default;
    
    return Object.entries(cityModifiers)
      .filter(([_, modifier]) => modifier > 0)
      .map(([type]) => type);
  };
  
  /**
   * Get daily transport budget estimate
   * @param {string} city - City name
   * @param {string} budgetLevel - Budget level (low, medium, high)
   * @returns {Object} - Daily transport budget
   */
  const getDailyTransportBudget = (city, budgetLevel = 'medium') => {
    const cityModifiers = CITY_MODIFIERS[city] || CITY_MODIFIERS.default;
    const availableTransport = getAvailableTransport(city);
    
    // Define budget levels
    const budgetMultipliers = {
      low: 0.7,
      medium: 1.0,
      high: 1.5
    };
    
    const multiplier = budgetMultipliers[budgetLevel] || 1.0;
    
    // Calculate average trip cost for each transport type
    const transportCosts = availableTransport.map(type => {
      const baseRate = BASE_RATES[type];
      const cityModifier = cityModifiers[type];
      
      // Assume average trip is 5 km
      const avgTripCost = (baseRate.basePrice + (5 * baseRate.pricePerKm)) * cityModifier;
      
      return {
        type,
        avgTripCost: Math.round(avgTripCost),
        recommendedForBudget: isRecommendedForBudget(type, budgetLevel)
      };
    });
    
    // Calculate daily budget assuming 3 trips per day
    const dailyBudget = transportCosts.reduce((acc, transport) => {
      if (transport.recommendedForBudget) {
        return acc + (transport.avgTripCost * 3 * multiplier);
      }
      return acc;
    }, 0) / transportCosts.filter(t => t.recommendedForBudget).length;
    
    return {
      city,
      budgetLevel,
      dailyBudget: Math.round(dailyBudget),
      recommendedTransport: transportCosts
        .filter(t => t.recommendedForBudget)
        .map(t => t.type),
      transportCosts
    };
  };
  
  /**
   * Determine if transport type is recommended for budget level
   * @param {string} transportType - Type of transport
   * @param {string} budgetLevel - Budget level
   * @returns {boolean} - Whether transport is recommended
   */
  const isRecommendedForBudget = (transportType, budgetLevel) => {
    const budgetTransport = {
      low: ['bus', 'metro', 'rickshaw'],
      medium: ['bus', 'metro', 'rickshaw', 'uber'],
      high: ['taxi', 'uber']
    };
    
    return budgetTransport[budgetLevel]?.includes(transportType) || false;
  };
  
  module.exports = {
    calculateFairPrice,
    getAvailableTransport,
    getDailyTransportBudget
  };