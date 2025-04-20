require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  
  // Firebase config
  FIREBASE_TYPE: process.env.FIREBASE_TYPE,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY_ID: process.env.FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID: process.env.FIREBASE_CLIENT_ID,
  FIREBASE_AUTH_URI: process.env.FIREBASE_AUTH_URI,
  FIREBASE_TOKEN_URI: process.env.FIREBASE_TOKEN_URI,
  FIREBASE_AUTH_PROVIDER_X509_CERT_URL: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  FIREBASE_CLIENT_X509_CERT_URL: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  
  // API keys
  OPEN_TRIP_MAP_API_KEY: process.env.OPEN_TRIP_MAP_API_KEY,
  OPEN_WEATHER_MAP_API_KEY: process.env.OPEN_WEATHER_MAP_API_KEY,
  
  // AI Service
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:5001',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};