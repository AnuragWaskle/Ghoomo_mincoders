import { format, parseISO } from 'date-fns';

const DayTab = ({ day, isActive, onClick }) => {
  const date = parseISO(day.date);
  const dayOfWeek = format(date, 'EEE');
  const dayOfMonth = format(date, 'd');

  // Weather icon based on condition
  const getWeatherIcon = () => {
    if (!day.weather) return null;
    
    const icon = day.weather.weatherIcon;
    
    if (icon?.includes('01')) return '☀️';
    if (icon?.includes('02')) return '🌤️';
    if (icon?.includes('03')) return '⛅';
    if (icon?.includes('04')) return '☁️';
    if (icon?.includes('09')) return '🌧️';
    if (icon?.includes('10')) return '🌦️';
    if (icon?.includes('11')) return '⛈️';
    if (icon?.includes('13')) return '❄️';
    if (icon?.includes('50')) return '🌫️';
    
    return '🌡️';
  };

  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-[100px] py-3 text-center border-b-2 transition-colors ${
        isActive
          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <div className="font-medium">{dayOfWeek}</div>
      <div className="text-lg font-bold">{dayOfMonth}</div>
      {day.weather && (
        <div className="flex justify-center items-center mt-1">
          <span className="text-sm mr-1">{getWeatherIcon()}</span>
          <span className="text-xs">{Math.round(day.weather.avgTemp)}°C</span>
        </div>
      )}
    </button>
  );
};

export default DayTab;