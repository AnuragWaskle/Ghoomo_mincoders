import { useState } from 'react';
import api from '../services/api';

export const useItinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const [currentItinerary, setCurrentItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate a new itinerary
  const generateItinerary = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.itineraries.generate(data);
      const newItinerary = response.data.itinerary;
      
      setCurrentItinerary(newItinerary);
      setItineraries(prev => [newItinerary, ...prev]);
      
      return newItinerary;
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError(err.response?.data?.message || 'Failed to generate itinerary');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user itineraries
  const getUserItineraries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.itineraries.getUserItineraries();
      setItineraries(response.data.itineraries);
      
      return response.data.itineraries;
    } catch (err) {
      console.error('Error fetching itineraries:', err);
      setError(err.response?.data?.message || 'Failed to fetch itineraries');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get itinerary by ID
  const getItineraryById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.itineraries.getItinerary(id);
      setCurrentItinerary(response.data.itinerary);
      
      return response.data.itinerary;
    } catch (err) {
      console.error('Error fetching itinerary:', err);
      setError(err.response?.data?.message || 'Failed to fetch itinerary');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update itinerary
  const updateItinerary = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.itineraries.updateItinerary(id, data);
      const updatedItinerary = response.data.itinerary;
      
      // Update current itinerary if it's the one being updated
      if (currentItinerary && currentItinerary.id === id) {
        setCurrentItinerary(updatedItinerary);
      }
      
      // Update itineraries list
      setItineraries(prev => 
        prev.map(item => item.id === id ? updatedItinerary : item)
      );
      
      return updatedItinerary;
    } catch (err) {
      console.error('Error updating itinerary:', err);
      setError(err.response?.data?.message || 'Failed to update itinerary');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete itinerary
  const deleteItinerary = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.itineraries.deleteItinerary(id);
      
      // Remove from itineraries list
      setItineraries(prev => prev.filter(item => item.id !== id));
      
      // Clear current itinerary if it's the one being deleted
      if (currentItinerary && currentItinerary.id === id) {
        setCurrentItinerary(null);
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting itinerary:', err);
      setError(err.response?.data?.message || 'Failed to delete itinerary');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Calculate transport price
  const calculateTransportPrice = async (data) => {
    try {
      const response = await api.itineraries.calculateTransport(data);
      return response.data.priceDetails;
    } catch (err) {
      console.error('Error calculating transport price:', err);
      throw err;
    }
  };

  return {
    itineraries,
    currentItinerary,
    loading,
    error,
    generateItinerary,
    getUserItineraries,
    getItineraryById,
    updateItinerary,
    deleteItinerary,
    calculateTransportPrice
  };
};