const ActivityCard = ({ activity }) => {
    // Activity icon based on type
    const getActivityIcon = () => {
      const type = activity.type;
      
      if (type === 'meal') return '🍽️';
      if (type === 'attraction' && activity.name.toLowerCase().includes('museum')) return '🏛️';
      if (type === 'attraction' && activity.name.toLowerCase().includes('temple')) return '🛕';
      if (type === 'attraction' && activity.name.toLowerCase().includes('park')) return '🌳';
      if (type === 'attraction' && activity.name.toLowerCase().includes('beach')) return '🏖️';
      if (type === 'attraction' && activity.name.toLowerCase().includes('market')) return '🛍️';
      if (type === 'attraction' && activity.name.toLowerCase().includes('fort')) return '🏰';
      if (type === 'attraction' && activity.name.toLowerCase().includes('palace')) return '🏯';
      if (type === 'attraction' && activity.name.toLowerCase().includes('garden')) return '🌷';
      if (type === 'attraction' && activity.name.toLowerCase().includes('mountain')) return '⛰️';
      if (type === 'attraction' && activity.name.toLowerCase().includes('lake')) return '🏞️';
      if (type === 'attraction' && activity.name.toLowerCase().includes('river')) return '🏞️';
      
      return '📍';
    };
  
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start">
          <div className="text-2xl mr-3">
            {getActivityIcon()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {activity.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {activity.description || 'Enjoy your visit!'}
            </p>
            
            {/* Cost */}
            {activity.estimatedCost > 0 && (
              <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                Estimated cost: ₹{activity.estimatedCost}
              </div>
            )}
            
            {/* Location */}
            {activity.lat && activity.lon && (
              <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                View on map
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default ActivityCard;