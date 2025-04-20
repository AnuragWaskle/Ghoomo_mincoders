import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useItinerary } from '../hooks/useItinerary';
import api from '../services/api';

// Components
import BudgetSlider from '../components/planner/BudgetSlider';
import DatePicker from '../components/planner/DatePicker';
import DestinationSearch from '../components/planner/DestinationSearch';
import PersonaSelector from '../components/planner/PersonaSelector';
import PlannerForm from '../components/planner/PlannerForm';

const PlanJourney = () => {
  const { userDetails } = useAuth();
  const { generateItinerary, loading, error } = useItinerary();
  const navigate = useNavigate();
  
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('medium');
  const [preferences, setPreferences] = useState({
    interests: [],
    accommodation: 'hotel',
    travelStyle: 'balanced',
    accessibility: false
  });
  const [formStep, setFormStep] = useState(1);
  const [formError, setFormError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Set initial preferences based on user's travel persona
  useEffect(() => {
    if (userDetails?.preferences) {
      setPreferences(prev => ({
        ...prev,
        interests: userDetails.preferences.interests || [],
        travelStyle: userDetails.preferences.travelPace || 'balanced',
        budgetLevel: userDetails.preferences.budgetSensitivity || 'medium'
      }));
      
      setBudget(userDetails.preferences.budgetSensitivity || 'medium');
    }
  }, [userDetails]);

  // Handle destination change
  const handleDestinationChange = (value) => {
    setDestination(value);
  };

  // Handle date change
  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Handle budget change
  const handleBudgetChange = (value) => {
    setBudget(value);
  };

  // Handle preferences change
  const handlePreferencesChange = (name, value) => {
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Move to next form step
  const handleNextStep = () => {
    // Validate current step
    if (formStep === 1 && !destination) {
      setFormError('Please enter a destination');
      return;
    }
    
    if (formStep === 2 && (!startDate || !endDate)) {
      setFormError('Please select both start and end dates');
      return;
    }
    
    setFormError('');
    setFormStep(prev => prev + 1);
  };

  // Move to previous form step
  const handlePrevStep = () => {
    setFormError('');
    setFormStep(prev => prev - 1);
  };

  // Generate itinerary
  const handleGenerateItinerary = async () => {
    try {
      setIsGenerating(true);
      setFormError('');
      
      // Validate form
      if (!destination) {
        setFormError('Please enter a destination');
        setFormStep(1);
        return;
      }
      
      if (!startDate || !endDate) {
        setFormError('Please select both start and end dates');
        setFormStep(2);
        return;
      }
      
      // Create itinerary data
      const itineraryData = {
        destination,
        startDate,
        endDate,
        budget,
        preferences
      };
      
      // Generate itinerary
      const newItinerary = await generateItinerary(itineraryData);
      
      // Navigate to itinerary page
      navigate(`/itinerary/${newItinerary.id}`);
      
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setFormError(err.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <h1 className="text-2xl font-bold text-white">Plan Your Journey</h1>
          <p className="text-blue-100">
            Tell us about your trip and we'll create a personalized itinerary
          </p>
        </div>

        {(formError || error) && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400">
            {formError || error}
          </div>
        )}

        <div className="p-6">
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
              <div className="animate-fadeIn">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Where do you want to go?
                </h2>
                <DestinationSearch 
                  value={destination} 
                  onChange={handleDestinationChange} 
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Enter a city, region, or country you'd like to visit
                </p>
              </div>
            )}

            {formStep === 2 && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  When are you traveling?
                </h2>
                <DatePicker 
                  startDate={startDate} 
                  endDate={endDate} 
                  onChange={handleDateChange} 
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Select your travel dates to plan your itinerary
                </p>
              </div>
            )}

            {formStep === 3 && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  What's your budget?
                </h2>
                <BudgetSlider 
                  value={budget} 
                  onChange={handleBudgetChange} 
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  This helps us suggest appropriate accommodations, activities, and transportation
                </p>
              </div>
            )}

            {formStep === 4 && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Customize your preferences
                </h2>
                <PersonaSelector 
                  preferences={preferences} 
                  onChange={handlePreferencesChange} 
                  travelPersona={userDetails?.travelPersona}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Fine-tune your preferences to create your perfect trip
                </p>
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
                onClick={handleGenerateItinerary}
                disabled={isGenerating || loading}
                className={`px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 ${
                  (isGenerating || loading) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isGenerating || loading ? 'Generating...' : 'Create Itinerary'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick templates section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Templates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setDestination('Goa, India');
              setFormStep(2);
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2" 
              alt="Goa Beaches" 
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Weekend in Goa</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Beach getaway with vibrant nightlife</p>
            </div>
          </div>
          
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setDestination('Jaipur, India');
              setFormStep(2);
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1599661046289-e31897846e41" 
              alt="Jaipur Palace" 
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Royal Jaipur</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cultural exploration of the Pink City</p>
            </div>
          </div>
          
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setDestination('Darjeeling, India');
              setFormStep(2);
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1544114017-157eab5dc81a" 
              alt="Darjeeling Hills" 
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Himalayan Retreat</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mountain escape with tea gardens</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanJourney;