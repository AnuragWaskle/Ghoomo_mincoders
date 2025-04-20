const axios = require('axios');
const config = require('../config/env');

// Create an axios instance for OpenTripMap API
const openTripMapClient = axios.create({
  baseURL: 'https://api.opentripmap.com/0.1/en',
  params: {
    apikey: config.OPEN_TRIP_MAP_API_KEY
  }
});

/**
 * Search for a destination by name
 * @param {string} query - City or place name
 * @returns {Promise<Array>} - List of matching destinations
 */
const searchDestination = async (query) => {
  try {
    const response = await openTripMapClient.get('/places/geoname', {
      params: {
        name: query
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching destination:', error);
    throw new Error('Failed to search destination');
  }
};

/**
 * Get destination details by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} - Destination details
 */
const getDestinationDetails = async (lat, lon) => {
  try {
    const response = await openTripMapClient.get('/places/radius', {
      params: {
        radius: 1000,
        lat,
        lon,
        format: 'json',
        limit: 1
      }
    });
    
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error getting destination details:', error);
    throw new Error('Failed to get destination details');
  }
};

/**
 * Get attractions near a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Search radius in meters
 * @param {string} kinds - Attraction types (comma-separated)
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} - List of attractions
 */
const getAttractions = async (lat, lon, radius = 5000, kinds = 'interesting_places', limit = 20) => {
  try {
    const response = await openTripMapClient.get('/places/radius', {
      params: {
        radius,
        lat,
        lon,
        kinds,
        format: 'json',
        limit,
        rate: 3 // Minimum rating (1-3)
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting attractions:', error);
    throw new Error('Failed to get attractions');
  }
};

/**
 * Get detailed information about a place
 * @param {string} xid - Place ID
 * @returns {Promise<Object>} - Place details
 */
const getPlaceDetails = async (xid) => {
  try {
    const response = await openTripMapClient.get(`/places/xid/${xid}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting place details for ${xid}:`, error);
    throw new Error('Failed to get place details');
  }
};

/**
 * Get hotels near a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Search radius in meters
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} - List of hotels
 */
const getHotels = async (lat, lon, radius = 5000, limit = 10) => {
  try {
    const response = await openTripMapClient.get('/places/radius', {
      params: {
        radius,
        lat,
        lon,
        kinds: 'accomodations',
        format: 'json',
        limit
      }
    });
    
    // Get detailed information for each hotel
    const hotels = await Promise.all(
      response.data.map(async (hotel) => {
        try {
          const details = await getPlaceDetails(hotel.xid);
          return {
            ...hotel,
            details
          };
        } catch (error) {
          return hotel;
        }
      })
    );
    
    return hotels;
  } catch (error) {
    console.error('Error getting hotels:', error);
    throw new Error('Failed to get hotels');
  }
};

/**
 * Get restaurants near a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Search radius in meters
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} - List of restaurants
 */
const getRestaurants = async (lat, lon, radius = 2000, limit = 15) => {
  try {
    const response = await openTripMapClient.get('/places/radius', {
      params: {
        radius,
        lat,
        lon,
        kinds: 'foods',
        format: 'json',
        limit
      }
    });
    
    // Get detailed information for top restaurants
    const restaurants = await Promise.all(
      response.data.slice(0, 10).map(async (restaurant) => {
        try {
          const details = await getPlaceDetails(restaurant.xid);
          return {
            ...restaurant,
            details
          };
        } catch (error) {
          return restaurant;
        }
      })
    );
    
    return restaurants;
  } catch (error) {
    console.error('Error getting restaurants:', error);
    throw new Error('Failed to get restaurants');
  }
};

/**
 * Get categorized places near a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} - Categorized places
 */
const getCategorizedPlaces = async (lat, lon) => {
  try {
    // Get attractions by different categories
    const [
      culturalAttractions,
      naturalAttractions,
      entertainmentVenues,
      shoppingPlaces,
      religiousPlaces,
      hotels,
      restaurants
    ] = await Promise.all([
      getAttractions(lat, lon, 5000, 'cultural,historic,architecture', 10),
      getAttractions(lat, lon, 10000, 'natural', 5),
      getAttractions(lat, lon, 5000, 'amusements,sport', 5),
      getAttractions(lat, lon, 3000, 'commercial', 5),
      getAttractions(lat, lon, 5000, 'religion', 3),
      getHotels(lat, lon),
      getRestaurants(lat, lon)
    ]);
    
    return {
      cultural: culturalAttractions,
      natural: naturalAttractions,
      entertainment: entertainmentVenues,
      shopping: shoppingPlaces,
      religious: religiousPlaces,
      hotels,
      restaurants
    };
  } catch (error) {
    console.error('Error getting categorized places:', error);
    throw new Error('Failed to get categorized places');
  }
};

module.exports = {
  searchDestination,
  getDestinationDetails,
  getAttractions,
  getPlaceDetails,
  getHotels,
  getRestaurants,
  getCategorizedPlaces
};