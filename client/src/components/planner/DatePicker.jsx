import { useState, useEffect } from 'react';

const DatePicker = ({ startDate, endDate, onChange }) => {
  const [start, setStart] = useState(startDate || '');
  const [end, setEnd] = useState(endDate || '');
  const [duration, setDuration] = useState(0);

  // Calculate duration when dates change
  useEffect(() => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const timeDiff = endDate.getTime() - startDate.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDuration(dayDiff);
    } else {
      setDuration(0);
    }
  }, [start, end]);

  // Update parent component when dates change
  useEffect(() => {
    if (start !== startDate || end !== endDate) {
      onChange(start, end);
    }
  }, [start, end]);

  // Handle start date change
  const handleStartChange = (e) => {
    const newStart = e.target.value;
    setStart(newStart);
    
    // If end date is before start date, update end date
    if (end && new Date(end) < new Date(newStart)) {
      setEnd(newStart);
    }
  };

  // Handle end date change
  const handleEndChange = (e) => {
    const newEnd = e.target.value;
    setEnd(newEnd);
    
    // If start date is after end date, update start date
    if (start && new Date(start) > new Date(newEnd)) {
      setStart(newEnd);
    }
  };

  // Get min date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Quick duration buttons
  const quickDurations = [
    { label: 'Weekend', days: 2 },
    { label: '3 Days', days: 3 },
    { label: '1 Week', days: 7 },
    { label: '2 Weeks', days: 14 }
  ];

  // Set duration quickly
  const setQuickDuration = (days) => {
    const startDate = start ? new Date(start) : new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + days - 1); // -1 because we count the start day
    
    setStart(startDate.toISOString().split('T')[0]);
    setEnd(endDate.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            value={start}
            onChange={handleStartChange}
            min={getMinDate()}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            value={end}
            onChange={handleEndChange}
            min={start || getMinDate()}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {duration > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200 text-center">
            {duration === 1 ? '1 day trip' : `${duration} days trip`}
          </p>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quick selection
        </h3>
        <div className="flex flex-wrap gap-2">
          {quickDurations.map((item, index) => (
            <button
              key={index}
              onClick={() => setQuickDuration(item.days)}
              className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatePicker;