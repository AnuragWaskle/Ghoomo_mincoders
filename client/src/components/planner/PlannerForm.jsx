import { useState } from 'react';
import DestinationSearch from './DestinationSearch';
import DatePicker from './DatePicker';
import BudgetSlider from './BudgetSlider';
import PersonaSelector from './PersonaSelector';

const PlannerForm = ({ onSubmit, initialValues = {} }) => {
  const [formData, setFormData] = useState({
    destination: initialValues.destination || '',
    startDate: initialValues.startDate || '',
    endDate: initialValues.endDate || '',
    budget: initialValues.budget || 'medium',
    preferences: initialValues.preferences || {
      interests: [],
      accommodation: 'hotel',
      travelStyle: 'balanced',
      accessibility: false
    }
  });
  const [formStep, setFormStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Handle destination change
  const handleDestinationChange = (value) => {
    setFormData(prev => ({ ...prev, destination: value }));
    setErrors(prev => ({ ...prev, destination: '' }));
  };

  // Handle date change
  const handleDateChange = (start, end) => {
    setFormData(prev => ({ ...prev, startDate: start, endDate: end }));
    setErrors(prev => ({ ...prev, dates: '' }));
  };

  // Handle budget change
  const handleBudgetChange = (value) => {
    setFormData(prev => ({ ...prev, budget: value }));
  };

  // Handle preferences change
  const handlePreferencesChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value
      }
    }));
  };

  // Validate form step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1 && !formData.destination) {
      newErrors.destination = 'Please enter a destination';
    }

    if (step === 2 && (!formData.startDate || !formData.endDate)) {
      newErrors.dates = 'Please select both start and end dates';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setFormStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateStep(formStep)) {
      onSubmit(formData);
    }
  };

  return (
    <div>
      {/* Progress steps */}
      <div className="flex items-center justify-between mb-8">
        <div className="w-full flex items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              formStep >= 1 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            1
          </div>
          <div 
            className={`flex-1 h-1 mx-2 ${
              formStep >= 2 
                ? 'bg-blue-600' 
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          ></div>
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              formStep >= 2 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            2
          </div>
          <div 
            className={`flex-1 h-1 mx-2 ${
              formStep >= 3 
                ? 'bg-blue-600' 
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          ></div>
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              formStep >= 3 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            3
          </div>
          <div 
            className={`flex-1 h-1 mx-2 ${
              formStep >= 4 
                ? 'bg-blue-600' 
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          ></div>
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              formStep >= 4 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            4
          </div>
        </div>
      </div>

      {/* Form steps */}
      <div className="mb-8">
        {formStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Where do you want to go?
            </h2>
            <DestinationSearch 
              value={formData.destination} 
              onChange={handleDestinationChange} 
            />
            {errors.destination && (
              <p className="mt-2 text-red-600 dark:text-red-400 text-sm">
                {errors.destination}
              </p>
            )}
          </div>
        )}

        {formStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              When are you traveling?
            </h2>
            <DatePicker 
              startDate={formData.startDate} 
              endDate={formData.endDate} 
              onChange={handleDateChange} 
            />
            {errors.dates && (
              <p className="mt-2 text-red-600 dark:text-red-400 text-sm">
                {errors.dates}
              </p>
            )}
          </div>
        )}

        {formStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              What's your budget?
            </h2>
            <BudgetSlider 
              value={formData.budget} 
              onChange={handleBudgetChange} 
            />
          </div>
        )}

        {formStep === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Customize your preferences
            </h2>
            <PersonaSelector 
              preferences={formData.preferences} 
              onChange={handlePreferencesChange} 
            />
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        {formStep > 1 ? (
          <button
            onClick={handlePrevStep}
            className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Back
          </button>
        ) : (
          <div></div>
        )}

        {formStep < 4 ? (
          <button
            onClick={handleNextStep}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700"
          >
            Create Itinerary
          </button>
        )}
      </div>
    </div>
  );
};

export default PlannerForm;