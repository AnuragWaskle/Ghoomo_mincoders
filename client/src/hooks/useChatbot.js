import { useState } from 'react';
import api from '../services/api';

export const useChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // Load chat history
  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.chatbot.getHistory();
      
      if (response.data.conversations) {
        const formattedMessages = response.data.conversations.map(conv => ({
          id: conv.id,
          text: conv.query,
          sender: 'user',
          timestamp: conv.timestamp
        })).flatMap((userMsg, index) => {
          const conv = response.data.conversations[index];
          return [
            userMsg,
            {
              id: `response-${conv.id}`,
              text: conv.response,
              sender: 'bot',
              timestamp: conv.timestamp
            }
          ];
        });
        
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
      setError('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  // Send message to chatbot
  const sendMessage = async (text, context = null) => {
    try {
      setLoading(true);
      setError(null);
      
      // Add user message to state immediately
      const userMessage = {
        id: `user-${Date.now()}`,
        text,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Send to API
      const response = await api.chatbot.askQuestion(text, context);
      
      // Add bot response to state
      const botMessage = {
        id: `bot-${Date.now()}`,
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Set suggestions
      if (response.data.suggestions) {
        setSuggestions(response.data.suggestions);
      }
      
      return botMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      
      // Add error message
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'bot',
        isError: true,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      return errorMessage;
    } finally {
      setLoading(false);
    }
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
    setSuggestions([]);
  };

  return {
    messages,
    loading,
    error,
    suggestions,
    sendMessage,
    loadHistory,
    clearChat
  };
};