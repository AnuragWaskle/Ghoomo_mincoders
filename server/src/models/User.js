/**
 * User model structure (Firestore)
 * 
 * This is a reference schema, not an actual code implementation
 * since Firestore is schemaless. This serves as documentation.
 */

const UserSchema = {
    uid: String,              // Firebase Auth UID
    email: String,            // User email
    name: String,             // User's full name
    photoURL: String,         // Profile picture URL
    createdAt: String,        // ISO date string
    updatedAt: String,        // ISO date string
    
    // Travel preferences
    travelPersona: String,    // e.g., "Foodie", "Adventurer", "Culture Enthusiast"
    preferences: {
      budget: String,         // e.g., "Budget", "Mid-range", "Luxury"
      interests: Array,       // e.g., ["Food", "History", "Adventure"]
      travelStyle: String,    // e.g., "Slow", "Fast-paced"
      accommodation: String,  // e.g., "Hostel", "Hotel", "Resort"
    },
    
    // User activity
    savedItineraries: Array,  // Array of itinerary IDs
    completedTrips: Array,    // Array of completed trip objects
    uploadedPhotos: Array,    // Array of photo IDs
    reviews: Array,           // Array of review IDs
    
    // Notifications
    notificationSettings: {
      email: Boolean,
      push: Boolean,
    },
  };
  
  module.exports = {
    UserSchema // For documentation purposes
  };