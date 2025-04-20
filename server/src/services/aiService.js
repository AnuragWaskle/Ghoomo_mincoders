const axios = require('axios');
const config = require('../config/env');

// Create an axios instance for the AI service
const aiClient = axios.create({
  baseURL: config.AI_SERVICE_URL,
  timeout: 10000
});

/**
 * Get quiz questions
 * @returns {Promise<Array>} - Quiz questions
 */
const getQuizQuestions = async () => {
  try {
    const response = await aiClient.get('/api/quiz/questions');
    return response.data.questions;
  } catch (error) {
    console.error('Error getting quiz questions:', error);
    throw new Error('Failed to get quiz questions');
  }
};

/**
 * Analyze quiz responses
 * @param {Object} responses - User's quiz responses
 * @returns {Promise<Object>} - Analysis results
 */
const analyzeQuizResponses = async (responses) => {
  try {
    const response = await aiClient.post('/api/quiz/analyze', {
      responses
    });
    
    return response.data.analysis;
  } catch (error) {
    console.error('Error analyzing quiz responses:', error);
    
    // Fallback analysis if the AI service fails
    return {
      primaryPersona: "Cultural Explorer",
      secondaryPersona: "Foodie",
      budgetSensitivity: "medium",
      interests: ["sightseeing", "local cuisine"],
      preferredActivities: ["visiting landmarks", "trying local food"],
      travelPace: "moderate"
    };
  }
};

/**
 * Get chatbot response
 * @param {string} query - User's question
 * @param {Object} context - Additional context
 * @returns {Promise<Object>} - Chatbot response
 */
const getChatbotResponse = async (query, context = null) => {
  try {
    const response = await aiClient.post('/api/chatbot/ask', {
      query,
      context
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    
    // Fallback response if the AI service fails
    return {
      success: false,
      response: "I'm having trouble connecting to my knowledge base right now. Please try again later.",
      suggestions: [
        "What are popular destinations in India?",
        "How can I plan a budget trip?",
        "What should I pack for my trip?"
      ]
    };
  }
};

module.exports = {
  getQuizQuestions,
  analyzeQuizResponses,
  getChatbotResponse
};