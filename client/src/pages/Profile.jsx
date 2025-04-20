import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import PhotoGrid from '../components/community/PhotoGrid';
import UploadForm from '../components/community/UploadForm';

const Profile = () => {
  const { id } = useParams();
  const { user, userDetails, updateUserProfile } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [activeTab, setActiveTab] = useState('photos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: ''
  });

  // Determine if this is the current user's profile
  const isCurrentUser = !id || (user && id === user.uid);

  // Fetch profile data and uploads
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userId = isCurrentUser ? user?.uid : id;
        
        if (!userId) {
          setLoading(false);
          return;
        }
        
        // Get user profile
        let profileResponse;
        if (isCurrentUser) {
          setProfileData(userDetails);
        } else {
          profileResponse = await api.users.getUserProfile(userId);
          setProfileData(profileResponse.data.user);
        }
        
        // Get user uploads
        const uploadsResponse = await api.uploads.getUserUploads(userId);
        setUploads(uploadsResponse.data.uploads || []);
        
        // Initialize edit form if current user
        if (isCurrentUser && userDetails) {
          setEditForm({
            name: userDetails.name || '',
            bio: userDetails.bio || '',
            location: userDetails.location || ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id, user, userDetails, isCurrentUser]);

  // Handle edit profile form submission
  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateUserProfile({
        name: editForm.name,
        bio: editForm.bio,
        location: editForm.location
      });
      
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  // Handle upload completion
  const handleUploadComplete = (newUpload) => {
    setUploads(prev => [newUpload, ...prev]);
    setShowUploadModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-red-50 dark:bg-red-900/30 p-6 rounded-lg text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profileData && !isCurrentUser) {
    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          User Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The user you're looking for doesn't exist or has been removed.
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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        {/* Cover photo */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        {/* Profile info */}
        <div className="px-6 py-4 flex flex-col md:flex-row md:items-end relative">
          {/* Profile picture */}
          <div className="absolute -top-16 left-6 w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700">
            {profileData?.photoURL ? (
              <img 
                src={profileData.photoURL} 
                alt={profileData.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                {profileData?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          
          {/* Profile details */}
          <div className="mt-16 md:mt-0 md:ml-36 flex-grow">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profileData?.name || 'Anonymous User'}
            </h1>
            
            {profileData?.travelPersona && (
              <div className="mt-1 inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
                {profileData.travelPersona}
              </div>
            )}
            
            {profileData?.location && (
              <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {profileData.location}
              </p>
            )}
            
            {profileData?.bio && (
              <p className="text-gray-800 dark:text-gray-200 mt-2">
                {profileData.bio}
              </p>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="mt-4 md:mt-0 flex">
            {isCurrentUser ? (
              <>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="ml-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  Upload
                </button>
              </>
            ) : (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Follow
              </button>
            )}
          </div>
        </div>
        
        {/* Profile stats */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex space-x-8">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {uploads.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Posts
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              0
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Followers
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              0
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Following
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 flex">
          <button
            onClick={() => setActiveTab('photos')}
            className={`py-4 px-4 font-medium ${
              activeTab === 'photos'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Photos
          </button>
          <button
            onClick={() => setActiveTab('trips')}
            className={`py-4 px-4 font-medium ${
              activeTab === 'trips'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Trips
          </button>
          {isCurrentUser && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-4 px-4 font-medium ${
                activeTab === 'saved'
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Saved
            </button>
          )}
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {activeTab === 'photos' && (
          <>
            {uploads.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📷</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No photos yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {isCurrentUser
                    ? "You haven't shared any photos yet."
                    : `${profileData?.name || 'This user'} hasn't shared any photos yet.`}
                </p>
                {isCurrentUser && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Share Your First Photo
                  </button>
                )}
              </div>
            ) : (
              <PhotoGrid uploads={uploads} />
            )}
          </>
        )}

        {activeTab === 'trips' && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No trips to show
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {isCurrentUser
                ? "You haven't created any public itineraries yet."
                : `${profileData?.name || 'This user'} hasn't created any public itineraries yet.`}
            </p>
            {isCurrentUser && (
              <Link
                to="/plan"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Plan a Trip
              </Link>
            )}
          </div>
        )}

        {activeTab === 'saved' && isCurrentUser && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔖</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No saved items
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You haven't saved any photos or itineraries yet.
            </p>
            <Link
              to="/discover"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Explore Content
            </Link>
          </div>
        )}
      </div>

      {/* Edit profile modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Profile
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleEditProfileSubmit}>
              {/* Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              {/* Bio */}
              <div className="mb-4">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  rows="3"
                  placeholder="Tell us about yourself..."
                />
              </div>
              
              {/* Location */}
              <div className="mb-6">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Where are you from? (e.g., Delhi, India)"
                />
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
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

export default Profile;