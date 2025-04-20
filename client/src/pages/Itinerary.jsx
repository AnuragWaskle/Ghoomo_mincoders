import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useItinerary } from '../hooks/useItinerary';
import { useChatbot } from '../hooks/useChatbot';
import { downloadItineraryPDF } from '../utils/pdfGenerator';

// Components
import DayTab from '../components/itinerary/DayTab';
import TimelineView from '../components/itinerary/TimelineView';
import BudgetChart from '../components/itinerary/BudgetChart';
import MapView from '../components/itinerary/MapView';

const Itinerary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItineraryById, deleteItinerary, loading, error } = useItinerary();
  const { sendMessage } = useChatbot();
  
  const [itinerary, setItinerary] = useState(null);
  const [activeDay, setActiveDay] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch itinerary data
  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const data = await getItineraryById(id);
        if (data) {
          setItinerary(data);
        }
      } catch (err) {
        console.error('Error fetching itinerary:', err);
      }
    };

    fetchItinerary();
  }, [id]);

  // Handle day change
  const handleDayChange = (day) => {
    setActiveDay(day);
  };

  // Handle delete itinerary
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteItinerary(id);
      navigate('/');
    } catch (err) {
      console.error('Error deleting itinerary:', err);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Handle download PDF
const handleDownloadPDF = async () => {
    try {
      await downloadItineraryPDF(itinerary);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to generate PDF. Please try again later.');
    }
  };

  // Handle ask AI about this itinerary
  const handleAskAI = () => {
    // Open chatbot and send a question about the itinerary
    const message = `Tell me more about my trip to ${itinerary?.destination?.name}`;
    sendMessage(message, {
      location: itinerary?.destination?.name,
      itinerary: {
        destination: itinerary?.destination,
        startDate: itinerary?.startDate,
        endDate: itinerary?.endDate,
        dailyItineraries: itinerary?.dailyItineraries?.map(day => ({
          date: day.date,
          activities: day.timeSlots.map(slot => slot.activity.name)
        }))
      }
    });
    
    // Find and click the chatbot trigger
    document.querySelector('.chatbot-trigger')?.click();
  };

  // Toggle map view
  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-red-50 dark:bg-red-900/30 p-6 rounded-lg text-center">
        <h2 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">
          Error Loading Itinerary
        </h2>
        <p className="text-red-600 dark:text-red-300 mb-4">
          {error}
        </p>
        <Link 
          to="/"
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
          Itinerary Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The itinerary you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Link 
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  const activeDayData = itinerary.dailyItineraries.find(day => day.day === activeDay);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Itinerary header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {itinerary.destination.name}, {itinerary.destination.country}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()} 
              ({itinerary.dailyItineraries.length} days)
            </p>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-2">
            <button
              onClick={toggleMapView}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
            <button
              onClick={handleAskAI}
              className="px-4 py-2 border border-purple-300 dark:border-purple-700 rounded-md text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ask AI
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 border border-blue-300 dark:border-blue-700 rounded-md text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 border border-red-300 dark:border-red-700 rounded-md text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Map view */}
      {showMap && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 overflow-hidden">
          <MapView 
            destination={itinerary.destination} 
            activities={activeDayData.timeSlots.map(slot => slot.activity)} 
          />
        </div>
      )}

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Itinerary timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {/* Day tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
              <div className="flex min-w-max">
                {itinerary.dailyItineraries.map(day => (
                  <DayTab 
                    key={day.day} 
                    day={day} 
                    isActive={day.day === activeDay} 
                    onClick={() => handleDayChange(day.day)} 
                  />
                ))}
              </div>
            </div>

            {/* Timeline view */}
            <div className="p-4">
              <TimelineView 
                timeSlots={activeDayData.timeSlots} 
                weather={activeDayData.weather} 
              />
            </div>
          </div>
        </div>

        {/* Right column - Budget and details */}
        <div>
          {/* Budget chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Daily Budget
            </h2>
            <BudgetChart costs={activeDayData.dailyCost} />
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-gray-800 dark:text-gray-200">
                <span>Total:</span>
                <span className="font-semibold">₹{activeDayData.dailyCost.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Weather card */}
          {activeDayData.weather && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Weather
              </h2>
              <div className="flex items-center">
                <div className="text-4xl mr-4">
                  {activeDayData.weather.weatherIcon?.includes('01') ? '☀️' :
                   activeDayData.weather.weatherIcon?.includes('02') ? '🌤️' :
                   activeDayData.weather.weatherIcon?.includes('03') ? '⛅' :
                   activeDayData.weather.weatherIcon?.includes('04') ? '☁️' :
                   activeDayData.weather.weatherIcon?.includes('09') ? '🌧️' :
                   activeDayData.weather.weatherIcon?.includes('10') ? '🌦️' :
                   activeDayData.weather.weatherIcon?.includes('11') ? '⛈️' :
                   activeDayData.weather.weatherIcon?.includes('13') ? '❄️' :
                   activeDayData.weather.weatherIcon?.includes('50') ? '🌫️' : '🌡️'}
                </div>
                <div>
                  <div className="text-gray-800 dark:text-gray-200 font-medium">
                    {activeDayData.weather.weatherDescription}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {activeDayData.weather.minTemp.toFixed(1)}°C - {activeDayData.weather.maxTemp.toFixed(1)}°C
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Humidity:</span>
                  <span>{activeDayData.weather.avgHumidity.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Wind:</span>
                  <span>{activeDayData.weather.avgWind.toFixed(1)} m/s</span>
                </div>
                {activeDayData.weather.totalRain > 0 && (
                  <div className="flex justify-between mt-1">
                    <span>Rain:</span>
                    <span>{activeDayData.weather.totalRain.toFixed(1)} mm</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Transport options */}
          {itinerary.transportBudget && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Transport Options
              </h2>
              <div className="space-y-3">
                {itinerary.transportBudget.recommendedTransport.map((type, index) => (
                  <div 
                    key={index} 
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">
                          {type === 'rickshaw' ? '🛺' :
                           type === 'taxi' ? '🚕' :
                           type === 'uber' ? '🚗' :
                           type === 'bus' ? '🚌' :
                           type === 'metro' ? '🚇' : '🚶'}
                        </span>
                        <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                          {type}
                        </span>
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        ₹{itinerary.transportBudget.transportCosts.find(t => t.type === type)?.avgTripCost || 0}/trip
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between font-medium">
                    <span>Daily transport budget:</span>
                    <span>₹{itinerary.transportBudget.dailyBudget}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Delete Itinerary
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this itinerary? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Itinerary;