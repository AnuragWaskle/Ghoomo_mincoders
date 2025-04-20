const aiService = require('../services/aiService');
const { db } = require('../config/firebase');

/**
 * Get quiz questions
 */
exports.getQuizQuestions = async (req, res, next) => {
  try {
    const questions = await aiService.getQuizQuestions();
    
    return res.status(200).json({
      questions
    });
  } catch (error) {
    console.error('Error in getQuizQuestions:', error);
    next(error);
  }
};

/**
 * Submit quiz responses
 */
exports.submitQuizResponses = async (req, res, next) => {
  try {
    const { responses } = req.body;
    const userId = req.user.uid;
    
    if (!responses) {
      return res.status(400).json({
        message: 'Quiz responses are required'
      });
    }
    
    // Analyze responses
    const analysis = await aiService.analyzeQuizResponses(responses);
    
    // Update user profile with travel persona
    await db.collection('users').doc(userId).update({
      travelPersona: analysis.primaryPersona,
      secondaryPersona: analysis.secondaryPersona,
      preferences: {
        budgetSensitivity: analysis.budgetSensitivity,
        interests: analysis.interests,
        preferredActivities: analysis.preferredActivities,
        travelPace: analysis.travelPace
      },
      quizCompleted: true,
      quizCompletedAt: new Date().toISOString()
    });
    
    return res.status(200).json({
      message: 'Quiz submitted successfully',
      analysis
    });
  } catch (error) {
    console.error('Error in submitQuizResponses:', error);
    next(error);
  }
};

/**
 * Get user's travel persona
 */
exports.getUserPersona = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    
    // Get user data
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    
    const userData = userDoc.data();
    
    // Check if user has completed the quiz
    if (!userData.quizCompleted) {
      return res.status(200).json({
        quizCompleted: false,
        message: 'User has not completed the travel persona quiz'
      });
    }
    
    return res.status(200).json({
      quizCompleted: true,
      travelPersona: userData.travelPersona,
      secondaryPersona: userData.secondaryPersona,
      preferences: userData.preferences
    });
  } catch (error) {
    console.error('Error in getUserPersona:', error);
    next(error);
  }
};