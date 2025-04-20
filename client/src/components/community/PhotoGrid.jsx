import { useState } from 'react';
import { Link } from 'react-router-dom';
import PhotoDetail from './PhotoDetail';

const PhotoGrid = ({ uploads }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseDetail = () => {
    setSelectedPhoto(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {uploads.map((upload) => (
          <div 
            key={upload.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
            onClick={() => handlePhotoClick(upload)}
          >
            <div className="relative pb-[100%] overflow-hidden">
              <img 
                src={upload.downloadURL} 
                alt={upload.caption || 'Travel photo'} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  {upload.userPhoto ? (
                    <img 
                      src={upload.userPhoto} 
                      alt={upload.userName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                      {upload.userName?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <Link 
                  to={`/profile/${upload.userId}`}
                  className="text-sm font-medium text-gray-900 dark:text-white hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {upload.userName || 'Anonymous'}
                </Link>
              </div>
              
              {upload.location && (
                <Link 
                  to={`/discover?q=${encodeURIComponent(upload.location)}`}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:underline flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {upload.location}
                </Link>
              )}
              
              {upload.caption && (
                <p className="mt-2 text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                  {upload.caption}
                </p>
              )}
              
              <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {upload.likes || 0}
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {upload.comments?.length || 0}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Photo detail modal */}
      {selectedPhoto && (
        <PhotoDetail 
          photo={selectedPhoto} 
          onClose={handleCloseDetail} 
        />
      )}
    </>
  );
};

export default PhotoGrid;