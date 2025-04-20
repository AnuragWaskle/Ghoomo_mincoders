import { useState, useEffect } from 'react';
import api from '../../services/api';

const DestinationSearch = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular destinations for quick selection
  const popularDestinations = [
    'Delhi, India',
    'Mumbai, India',
    'Goa, India',
    'Jaipur, India',
    'Varanasi, India',
    'Darjeeling, India',
    'Agra, India',
    'Shimla, India',
    'Udaipur, India',
    'Rishikesh, India'
  ];

  // Update search term when value changes
  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  // Fetch destination suggestions
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      
      // In a real app, we would fetch suggestions from the API
      // For now, we'll just filter the popular destinations
      const filtered = popularDestinations.filter(dest => 
        dest.toLowerCase().includes(query.toLowerCase())
      );
      
      setSuggestions(filtered);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);
    fetchSuggestions(value);
  };

  // Handle suggestion selection
  const handleSelect = (suggestion) => {
    setSearchTerm(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
  };

  // Handle popular destination selection
  const handlePopularSelect = (destination) => {
    setSearchTerm(destination);
    onChange(destination);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <div className="pl-3 pr-2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search destinations..."
            className="w-full py-3 px-2 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
          {searchTerm && (
            <button
              className="pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => {
                setSearchTerm('');
                onChange('');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSelect(suggestion)}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-800 dark:text-gray-200">{suggestion}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popular destinations */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Popular destinations
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularDestinations.slice(0, 6).map((destination, index) => (
            <button
              key={index}
              onClick={() => handlePopularSelect(destination)}
              className={`px-3 py-1 text-sm rounded-full ${
                searchTerm === destination
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {destination.split(',')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationSearch;