import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const PhotoDetail = ({ photo, onClose }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(photo.likes || 0);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await api.uploads.getComments(photo.id);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [photo.id]);

  // Handle comment submission
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const response = await api.uploads.commentOnUpload(photo.id, newComment);
      setComments([...comments, response.data.comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle like/unlike
  const handleLikeToggle = async () => {
    try {
      const response = await api.uploads.likeUpload(photo.id);
      setLiked(response.data.liked);
      setLikesCount(prev => response.data.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-opacity z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="w-full md:w-3/5 bg-black flex items-center justify-center">
          <img
            src={photo.downloadURL}
            alt={photo.caption || 'Travel photo'}
            className="max-h-[70vh] max-w-full object-contain"
          />
        </div>

        {/* Details and comments */}
        <div className="w-full md:w-2/5 flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                {photo.userPhoto ? (
                  <img
                    src={photo.userPhoto}
                    alt={photo.userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                    {photo.userName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div>
                <Link
                  to={`/profile/${photo.userId}`}
                  className="font-medium text-gray-900 dark:text-white hover:underline"
                >
                  {photo.userName || 'Anonymous'}
                </Link>
                {photo.location && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {photo.location}
                  </div>
                )}
              </div>
            </div>

            {photo.caption && (
              <p className="mt-3 text-gray-800 dark:text-gray-200">
                {photo.caption}
              </p>
            )}

            {photo.tags && photo.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {photo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              {formatDate(photo.createdAt)}
            </div>
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto p-4">
            {comments.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-6">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                      {comment.userPhoto ? (
                        <img
                          src={comment.userPhoto}
                          alt={comment.userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                          {comment.userName?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                        <Link
                          to={`/profile/${comment.userId}`}
                          className="font-medium text-gray-900 dark:text-white text-sm hover:underline"
                        >
                          {comment.userName || 'Anonymous'}
                        </Link>
                        <p className="text-gray-800 dark:text-gray-200 text-sm mt-1">
                          {comment.text}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center mb-3">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center mr-4 ${
                  liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill={liked ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="ml-1">{likesCount}</span>
              </button>
              <button
                className="flex items-center text-gray-500 dark:text-gray-400"
                onClick={() => document.getElementById('comment-input').focus()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="ml-1">{comments.length}</span>
              </button>
            </div>

            {/* Comment form */}
            <form onSubmit={handleSubmitComment} className="flex">
              <input
                id="comment-input"
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border border-gray-300 dark:border-gray-700 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={loading || !user}
              />
              <button
                type="submit"
                className={`bg-blue-500 text-white px-4 py-2 rounded-r-lg ${
                  loading || !newComment.trim() || !user
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-600'
                }`}
                disabled={loading || !newComment.trim() || !user}
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </form>
            {!user && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                <Link to="/login" className="text-blue-500 hover:underline">
                  Sign in
                </Link>{' '}
                to like or comment on this photo.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;