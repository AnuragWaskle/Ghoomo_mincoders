import { format, parseISO } from 'date-fns';

const TimelineView = ({ timeSlots, weather }) => {
  // Format time (09:00 -> 9 AM)
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}${minutes !== '00' ? `:${minutes}` : ''} ${ampm}`;
  };

  // Activity icon based on type
  const getActivityIcon = (activity) => {
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

  // Weather summary for the day
  const renderWeatherSummary = () => {
    if (!weather) return null;
    
    return (
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center">
          <div className="text-3xl mr-3">
            {weather.weatherIcon?.includes('01') ? '☀️' :
             weather.weatherIcon?.includes('02') ? '🌤️' :
             weather.weatherIcon?.includes('03') ? '⛅' :
             weather.weatherIcon?.includes('04') ? '☁️' :
             weather.weatherIcon?.includes('09') ? '🌧️' :
             weather.weatherIcon?.includes('10') ? '🌦️' :
             weather.weatherIcon?.includes('11') ? '⛈️' :
             weather.weatherIcon?.includes('13') ? '❄️' :
             weather.weatherIcon?.includes('50') ? '🌫️' : '🌡️'}
          </div>
          <div>
            <div className="font-medium text-gray-800 dark:text-gray-200">
              {weather.weatherDescription}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {weather.minTemp.toFixed(1)}°C - {weather.maxTemp.toFixed(1)}°C
            </div>
          </div>
        </div>
        
        {(weather.totalRain > 0 || weather.weatherDescription.toLowerCase().includes('rain')) && (
          <div className="mt-3 text-sm text-blue-800 dark:text-blue-300">
            <p>💡 Don't forget to carry an umbrella today!</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {renderWeatherSummary()}
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
        
        {/* Timeline events */}
        <div className="space-y-6">
          {timeSlots.map((slot, index) => (
            <div key={index} className="relative flex">
              {/* Time */}
              <div className="flex-none w-16 text-right pr-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                {formatTime(slot.startTime)}
              </div>
              
              {/* Circle */}
              <div className="flex-none w-12 flex justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 z-10"></div>
              </div>
              
              {/* Content */}
              <div className="flex-grow pl-2 pb-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">
                      {getActivityIcon(slot.activity)}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {slot.activity.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {slot.activity.description || 'Enjoy your visit!'}
                      </p>
                      
                      {/* Time duration */}
                      <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </div>
                      
                      {/* Cost */}
                      {slot.activity.estimatedCost > 0 && (
                        <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                          Estimated cost: ₹{slot.activity.estimatedCost}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineView;