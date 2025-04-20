const express = require('express');
const quizController = require('../controllers/quizController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get quiz questions (public route)
router.get('/questions', quizController.getQuizQuestions);

// Protected routes
router.use(authenticate);

// Submit quiz responses
router.post('/submit', quizController.submitQuizResponses);

// Get user's travel persona
router.get('/persona', quizController.getUserPersona);

module.exports = router;