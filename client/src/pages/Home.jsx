import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useItinerary } from '../hooks/useItinerary';
import api from '../services/api';

const Home = () => {
  const { userDetails } = useAuth();
  const { getUserItineraries } = useItinerary();
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itineraries, setItineraries] = useState([]);
  const [itinerariesLoading, setItinerariesLoading] = useState(true);

  // Fetch community feeds
  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        setLoading(true);
        const response = await api.uploads.getFeed();
        setFeeds(response.data.uploads || []);
      } catch (error) {
        console.error('Error fetching feeds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  // Fetch user itineraries
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setItinerariesLoading(true);
        const data = await getUserItineraries();
        setItineraries(data || []);
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      } finally {
        setItinerariesLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  // If we don't have real feeds yet, use mock data
  const mockFeeds = [
    {
      id: 'feed1',
      userId: 'user1',
      userName: 'Rahul Sharma',
      userPhoto: 'https://randomuser.me/api/portraits/men/32.jpg',
      location: 'Jaipur, Rajasthan',
      caption: 'The colors of Hawa Mahal are just breathtaking! 🏰✨ #Jaipur #Travel',
      photoUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41',
      likes: 125,
      comments: 14,
      createdAt: '2023-09-15T10:30:00Z'
    },
    {
      id: 'feed2',
      userId: 'user2',
      userName: 'Priya Patel',
      userPhoto: 'https://randomuser.me/api/portraits/women/44.jpg',
      location: 'Goa, India',
      caption: 'Beach vibes and perfect sunsets. Goa never disappoints! 🏖️ #BeachLife #Goa',
      photoUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2',
      likes: 210,
      comments: 23,
      createdAt: '2023-09-14T15:45:00Z'
    },
    {
      id: 'feed3',
      userId: 'user3',
      userName: 'Amit Desai',
      userPhoto: 'https://randomuser.me/api/portraits/men/62.jpg',
      location: 'Darjeeling, West Bengal',
      caption: 'Morning tea with this view. The mountains are calling! ☕🏔️ #Darjeeling #HimalayanViews',
      photoUrl: 'https://images.unsplash.com/photo-1544114017-157eab5dc81a',
      likes: 89,
      comments: 7,
      createdAt: '2023-09-13T08:20:00Z'
    }
  ];

  // Use mock data if no real feeds
  const displayFeeds = feeds.length > 0 ? feeds : mockFeeds;

  // Mock itineraries if needed
  const mockItineraries = [
    {
      id: 'itin1',
      destination: { name: 'Goa', country: 'India' },
      startDate: '2023-10-15',
      endDate: '2023-10-20',
      dailyItineraries: [{ day: 1 }, { day: 2 }, { day: 3 }]
    },
    {
      id: 'itin2',
      destination: { name: 'Jaipur', country: 'India' },
      startDate: '2023-11-05',
      endDate: '2023-11-10',
      dailyItineraries: [{ day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }]
    }
  ];

  // Use mock data if no real itineraries
  const displayItineraries = itineraries.length > 0 ? itineraries : mockItineraries;

  return (
    <div className="container mx-auto">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {userDetails?.name || 'Traveler'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {userDetails?.travelPersona
            ? `Your travel persona: ${userDetails.travelPersona}`
            : 'Complete your travel persona quiz to get personalized recommendations'}
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          to="/plan"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-bold mb-2">Plan New Trip</h3>
          <p className="text-blue-100">Create a personalized itinerary for your next adventure</p>
        </Link>
        
        <Link
          to="/discover"
          className="bg-gradient-to-r from-teal-500 to-green-500 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-bold mb-2">Discover Places</h3>
          <p className="text-teal-100">Explore community photos and travel experiences</p>
        </Link>
        
        <div
          onClick={() => document.querySelector('.chatbot-trigger')?.click()}
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <h3 className="text-xl font-bold mb-2">Ask Assistant</h3>
          <p className="text-orange-100">Get travel tips and recommendations from our AI</p>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Travel Feed</h2>
            </div>
            
            {loading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayFeeds.map(feed => (
                  <div key={feed.id} className="p-4">
                    {/* User info */}
                    <div className="flex items-center mb-3">
                      <img
                        src={feed.userPhoto}
                        alt={feed.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-gray-900 dark:text-white">{feed.userName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{feed.location}</p>
                      </div>
                    </div>
                    
                    {/* Image */}
                    <div className="rounded-lg overflow-hidden mb-3">
                      <img
                        src={feed.photoUrl}
                        alt={feed.caption}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    
                    {/* Caption */}
                    <p className="text-gray-800 dark:text-gray-200 mb-3">{feed.caption}</p>
                    
                    {/* Actions */}
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <button className="flex items-center mr-4 hover:text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {feed.likes}
                      </button>
                      <button className="flex items-center hover:text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {feed.comments}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column - Itineraries & Trending */}
        <div className="space-y-8">
          {/* Your Itineraries */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Trips</h2>
              <Link to="/plan" className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 text-sm">
                Plan New
              </Link>
            </div>
            
            {itinerariesLoading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayItineraries.length > 0 ? (
                  displayItineraries.map(itinerary => (
                    <Link
                      key={itinerary.id}
                      to={`/itinerary/${itinerary.id}`}
                      className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {itinerary.destination.name}, {itinerary.destination.country}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                          {itinerary.dailyItineraries.length} days
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    <p>No trips planned yet.</p>
                    <Link
                      to="/plan"
                      className="mt-2 inline-block text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                    >
                      Plan your first trip
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Trending Destinations */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trending Destinations</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="group relative rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1587474260584-136574528ed5"
                    alt="Goa beaches"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-3 text-white">
                      <h3 className="font-bold">Goa</h3>
                      <p className="text-sm text-gray-200">Beach paradise</p>
                    </div>
                  </div>
                </div>
                
                <div className="group relative rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1592635196078-9fec71718cf4"
                    alt="Jaipur palaces"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-3 text-white">
                      <h3 className="font-bold">Jaipur</h3>
                      <p className="text-sm text-gray-200">Pink City</p>
                    </div>
                  </div>
                </div>
                
                <div className="group relative rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1601791074012-d4e0ee30d77a"
                    alt="Darjeeling tea gardens"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-3 text-white">
                      <h3 className="font-bold">Darjeeling</h3>
                      <p className="text-sm text-gray-200">Mountain retreat</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;