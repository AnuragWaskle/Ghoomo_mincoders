const aiService = require('../services/aiService');
const itineraryService = require('../services/itineraryService');
const { db } = require('../config/firebase');

/**
 * Get chatbot response
 */
exports.getChatbotResponse = async (req, res, next) => {
  try {
    const { query, itineraryId, location } = req.body;
    const userId = req.user.uid;
    
    if (!query) {
      return res.status(400).json({
        message: 'Query is required'
      });
    }
    
    // Build context for the chatbot
    const context = {};
    
    // Add location to context if provided
    if (location) {
      context.location = location;
    }
    
    // Add user preferences to context
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      context.userPreferences = {
        travelPersona: userData.travelPersona,
        preferences: userData.preferences
      };
    }
    
    // Add itinerary to context if provided
    if (itineraryId) {
      try {
        const itinerary = await itineraryService.getItineraryById(itineraryId, userId);
        context.itinerary = {
          destination: itinerary.destination,
          startDate: itinerary.startDate,
          endDate: itinerary.endDate,
          dailyItineraries: itinerary.dailyItineraries.map(day => ({
            date: day.date,
            activities: day.timeSlots.map(slot => slot.activity.name)
          }))
        };
      } catch (error) {
        console.error('Error getting itinerary for chatbot context:', error);
        // Continue without itinerary context
      }
    }
    
    // Get response from AI service
    const response = await aiService.getChatbotResponse(query, context);
    
    // Save the conversation to the database
    await saveConversation(userId, query, response.response);
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error in getChatbotResponse:', error);
    next(error);
  }
};

/**
 * Get conversation history
 */
exports.getConversationHistory = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { limit = 20 } = req.query;
    
    // Get conversation history from Firestore
    const snapshot = await db
      .collection('conversations')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit))
      .get();
    
    const conversations = snapshot.docs.map(doc => doc.data());
    
    return res.status(200).json({
      conversations: conversations.reverse() // Return in chronological order
    });
  } catch (error) {
    console.error('Error in getConversationHistory:', error);
    next(error);
  }
};

/**
 * Save conversation to Firestore
 * @param {string} userId - User ID
 * @param {string} query - User's question
 * @param {string} response - Chatbot's response
 */
const saveConversation = async (userId, query, response) => {
  try {
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    await db.collection('conversations').doc(conversationId).set({
      id: conversationId,
      userId,
      query,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving conversation:', error);
    // Don't throw the error to avoid breaking the response flow
  }
};