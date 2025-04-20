import { useState, useEffect } from 'react';

const BudgetSlider = ({ value, onChange }) => {
  const [budget, setBudget] = useState(value || 'medium');

  // Budget options
  const budgetOptions = [
    { value: 'low', label: 'Budget', description: 'Hostels, street food, public transport' },
    { value: 'medium', label: 'Mid-range', description: '3-star hotels, casual restaurants, some taxis' },
    { value: 'high', label: 'Luxury', description: '5-star hotels, fine dining, private transport' }
  ];

  // Update budget when value changes
  useEffect(() => {
    setBudget(value || 'medium');
  }, [value]);

  // Handle budget change
  const handleBudgetChange = (newBudget) => {
    setBudget(newBudget);
    onChange(newBudget);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {budgetOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleBudgetChange(option.value)}
            className={`text-center flex-1 mx-1 p-4 rounded-lg border-2 transition-all ${
              budget === option.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex flex-col items-center">
              <span className={`text-lg font-medium ${
                budget === option.value
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {option.label}
              </span>
              <div className="mt-2 flex">
                {[...Array(option.value === 'low' ? 1 : option.value === 'medium' ? 2 : 3)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-xl ${
                      budget === option.value
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    ₹
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {option.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Visual slider */}
      <div className="relative pt-1">
        <div className="flex h-2 overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600"
            style={{ 
              width: budget === 'low' 
                ? '33%' 
                : budget === 'medium' 
                ? '66%' 
                : '100%' 
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
          <span>Economical</span>
          <span>Balanced</span>
          <span>Premium</span>
        </div>
      </div>

      {/* Budget estimates */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Estimated daily budget per person:
        </h3>
        <div className="flex justify-between text-gray-800 dark:text-gray-200">
          <div>
            <span className="font-medium">
              {budget === 'low' 
                ? '₹1,500 - ₹3,000' 
                : budget === 'medium' 
                ? '₹3,000 - ₹7,000' 
                : '₹7,000+'}
            </span>
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            Includes accommodation, food, activities, and local transport
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSlider;