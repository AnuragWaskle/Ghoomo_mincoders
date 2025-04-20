import { useState, useEffect } from 'react';

const PersonaSelector = ({ preferences, onChange, travelPersona }) => {
  // Available interests
  const interestOptions = [
    { value: 'culture', label: 'Culture', icon: '🏛️' },
    { value: 'food', label: 'Food', icon: '🍽️' },
    { value: 'adventure', label: 'Adventure', icon: '🧗' },
    { value: 'nature', label: 'Nature', icon: '🌳' },
    { value: 'history', label: 'History', icon: '🏺' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'relaxation', label: 'Relaxation', icon: '🧘' },
    { value: 'nightlife', label: 'Nightlife', icon: '🌃' },
    { value: 'art', label: 'Art', icon: '🎨' },
    { value: 'photography', label: 'Photography', icon: '📸' }
  ];

  // Accommodation options
  const accommodationOptions = [
    { value: 'hostel', label: 'Hostel', icon: '🛏️' },
    { value: 'hotel', label: 'Hotel', icon: '🏨' },
    { value: 'resort', label: 'Resort', icon: '🌴' },
    { value: 'homestay', label: 'Homestay', icon: '🏡' }
  ];

  // Travel style options
  const travelStyleOptions = [
    { value: 'fast', label: 'Fast-paced', description: 'Many activities each day' },
    { value: 'balanced', label: 'Balanced', description: 'Mix of activities and rest' },
    { value: 'slow', label: 'Relaxed', description: 'Fewer activities, more leisure' }
  ];

  // Handle interest selection
  const handleInterestToggle = (interest) => {
    const updatedInterests = preferences.interests.includes(interest)
      ? preferences.interests.filter(i => i !== interest)
      : [...preferences.interests, interest];
    
    onChange('interests', updatedInterests);
  };

  // Handle accommodation selection
  const handleAccommodationChange = (accommodation) => {
    onChange('accommodation', accommodation);
  };

  // Handle travel style selection
  const handleTravelStyleChange = (style) => {
    onChange('travelStyle', style);
  };

  // Handle accessibility toggle
  const handleAccessibilityToggle = () => {
    onChange('accessibility', !preferences.accessibility);
  };

  return (
    <div className="space-y-6">
      {/* Travel persona banner */}
      {travelPersona && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center">
            <div className="mr-3 text-2xl">
              {travelPersona === 'Foodie' ? '🍽️' : 
               travelPersona === 'Adventurer' ? '🧗' : 
               travelPersona === 'Cultural Explorer' ? '🏛️' : 
               travelPersona === 'Relaxer' ? '🧘' : 
               travelPersona === 'Shopaholic' ? '🛍️' : '✈️'}
            </div>
            <div>
              <h3 className="font-medium">Your Travel Persona: {travelPersona}</h3>
              <p className="text-sm text-blue-100">
                We've customized some preferences based on your persona
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interests */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
          Interests
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Select your interests to personalize your itinerary
        </p>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => (
            <button
              key={interest.value}
              onClick={() => handleInterestToggle(interest.value)}
              className={`px-4 py-2 rounded-full flex items-center ${
                preferences.interests.includes(interest.value)
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="mr-1">{interest.icon}</span>
              {interest.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accommodation */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
          Preferred Accommodation
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {accommodationOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAccommodationChange(option.value)}
              className={`p-3 rounded-lg border-2 flex flex-col items-center ${
                preferences.accommodation === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span className="text-2xl mb-1">{option.icon}</span>
              <span className={`text-sm ${
                preferences.accommodation === option.value
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Travel Style */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
          Travel Pace
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {travelStyleOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleTravelStyleChange(option.value)}
              className={`p-4 rounded-lg border-2 ${
                preferences.travelStyle === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <h4 className={`font-medium ${
                preferences.travelStyle === option.value
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {option.label}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {option.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility */}
      <div className="flex items-center">
        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={preferences.accessibility}
              onChange={handleAccessibilityToggle}
              className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              I need accessible options (wheelchair access, limited mobility)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelector;