import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PhotoGrid from '../components/community/PhotoGrid';
import UploadForm from '../components/community/UploadForm';
import LocationFilter from '../components/community/LocationFilter';

const Discover = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const loaderRef = useRef(null);

  // Parse query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const q = queryParams.get('q');
    if (q) {
      setSearchQuery(q);
      setSelectedLocation(q);
      setActiveFilter('location');
    }
  }, [location.search]);

  // Fetch uploads based on active filter
  useEffect(() => {
    const fetchUploads = async () => {
      try {
        setLoading(true);
        let response;

        if (activeFilter === 'location' && selectedLocation) {
          response = await api.uploads.getUploadsByLocation(selectedLocation);
          setUploads(response.data.uploads || []);
        } else {
          response = await api.uploads.getFeed(pagination.page, pagination.limit);
          
          if (pagination.page === 1) {
            setUploads(response.data.uploads || []);
          } else {
            setUploads(prev => [...prev, ...(response.data.uploads || [])]);
          }
          
          setPagination({
            page: response.data.pagination.page,
            limit: response.data.pagination.limit,
            totalPages: response.data.pagination.totalPages
          });
        }
      } catch (err) {
        console.error('Error fetching uploads:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, [activeFilter, selectedLocation, pagination.page]);

  // Intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && pagination.page < pagination.totalPages) {
          setPagination(prev => ({ ...prev, page: prev.page + 1 }));
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, pagination.page, pagination.totalPages]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedLocation(searchQuery);
      setActiveFilter('location');
      navigate(`/discover?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setPagination({ page: 1, limit: 12, totalPages: 1 });
      setSelectedLocation(null);
      navigate('/discover');
    }
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setActiveFilter('location');
    navigate(`/discover?q=${encodeURIComponent(location)}`);
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'map' : 'grid');
  };

  // Handle upload completion
  const handleUploadComplete = (newUpload) => {
    setUploads(prev => [newUpload, ...prev]);
    setShowUploadModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Discover Travel Experiences
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Explore photos and stories from the community
            </p>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
              </svg>
              Share Your Experience
            </button>
            <button
              onClick={toggleViewMode}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
            >
              {viewMode === 'grid' ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Map View
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Grid View
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="mt-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search form */}
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by location (e.g., Jaipur, Goa)"
                  className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Filter buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2 rounded-md ${
                  activeFilter === 'all'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange('trending')}
                className={`px-4 py-2 rounded-md ${
                  activeFilter === 'trending'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => handleFilterChange('following')}
                className={`px-4 py-2 rounded-md ${
                  activeFilter === 'following'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Following
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Location filters */}
      <LocationFilter 
        selectedLocation={selectedLocation}
        onLocationSelect={handleLocationSelect}
      />

      {/* Content area */}
      {loading && uploads.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : uploads.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="text-5xl mb-4">📷</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No photos yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {activeFilter === 'location'
              ? `Be the first to share photos from ${selectedLocation}!`
              : activeFilter === 'following'
              ? "You're not following anyone yet or they haven't shared any photos."
              : "No photos have been shared yet. Be the first!"}
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Share Your Experience
          </button>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <PhotoGrid uploads={uploads} />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-[600px]">
              {/* Map view - This would be implemented with MapBox in a real application */}
              <div className="h-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Map view coming soon...
                </p>
              </div>
            </div>
          )}

          {/* Loader for infinite scrolling */}
          {!loading && pagination.page < pagination.totalPages && (
            <div ref={loaderRef} className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </>
      )}

      {/* Upload modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Share Your Experience
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <UploadForm 
              onUploadComplete={handleUploadComplete} 
              onCancel={() => setShowUploadModal(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;