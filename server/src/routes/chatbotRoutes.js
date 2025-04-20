const express = require('express');
const chatbotController = require('../controllers/chatbotController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get chatbot response
router.post('/ask', chatbotController.getChatbotResponse);

// Get conversation history
router.get('/history', chatbotController.getConversationHistory);

module.exports = router;