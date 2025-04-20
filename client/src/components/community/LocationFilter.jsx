import { useState, useEffect } from 'react';

const LocationFilter = ({ selectedLocation, onLocationSelect }) => {
  // Popular locations in India
  const popularLocations = [
    'Delhi',
    'Mumbai',
    'Goa',
    'Jaipur',
    'Agra',
    'Varanasi',
    'Udaipur',
    'Darjeeling',
    'Shimla',
    'Rishikesh',
    'Kerala',
    'Ladakh'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 overflow-x-auto">
      <div className="flex space-x-2 min-w-max">
        {popularLocations.map((location) => (
          <button
            key={location}
            onClick={() => onLocationSelect(location)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedLocation === location
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {location}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationFilter;