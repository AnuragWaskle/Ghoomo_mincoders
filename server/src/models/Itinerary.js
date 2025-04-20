/**
 * Itinerary model structure (Firestore)
 * 
 * This is a reference schema, not an actual code implementation
 * since Firestore is schemaless. This serves as documentation.
 */

const ItinerarySchema = {
    id: String,              // Unique itinerary ID
    userId: String,          // User who created the itinerary
    
    // Destination info
    destination: {
      name: String,          // City/place name
      country: String,       // Country
      lat: Number,           // Latitude
      lon: Number            // Longitude
    },
    
    // Trip details
    startDate: String,       // ISO date string
    endDate: String,         // ISO date string
    budget: String,          // Budget level (low, medium, high)
    travelPersona: String,   // User's travel persona
    
    // User preferences
    preferences: {
      interests: Array,      // Array of interests
      accommodation: String, // Preferred accommodation type
      travelStyle: String,   // Travel style
      accessibility: Boolean // Accessibility requirements
    },
    
    // Daily itineraries
    dailyItineraries: [
      {
        day: Number,         // Day number
        date: String,        // ISO date string
        
        // Weather info
        weather: {
          weatherDescription: String,
          weatherIcon: String,
          maxTemp: Number,
          minTemp: Number,
          avgTemp: Number,
          avgWind: Number,
          avgHumidity: Number,
          totalRain: Number
        },
        
        // Time slots for activities
        timeSlots: [
          {
            startTime: String,  // HH:MM format
            endTime: String,    // HH:MM format
            activity: {
              type: String,     // attraction, meal, transport
              name: String,     // Activity name
              description: String,
              xid: String,      // OpenTripMap ID (if applicable)
              lat: Number,      // Latitude
              lon: Number,      // Longitude
              estimatedCost: Number,
              details: Object   // Additional details
            }
          }
        ],
        
        // Daily cost breakdown
        dailyCost: {
          activities: Number,
          meals: Number,
          transport: Number,
          accommodation: Number,
          total: Number
        }
      }
    ],
    
    // Weather forecast
    weather: Array,
    
    // Transport budget
    transportBudget: {
      dailyBudget: Number,
      recommendedTransport: Array,
      transportCosts: Array
    },
    
    // Timestamps
    createdAt: String,       // ISO date string
    updatedAt: String        // ISO date string
  };
  
  module.exports = {
    ItinerarySchema // For documentation purposes
  };