import { useState, useEffect, useRef } from 'react';
import { useChatbot } from '../../hooks/useChatbot';

const ChatBot = ({ isOpen, onToggle }) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const {
    messages,
    loading,
    suggestions,
    sendMessage,
    loadHistory,
    clearChat
  } = useChatbot();

  // Load chat history when first expanded
  useEffect(() => {
    if (isExpanded && messages.length === 0) {
      loadHistory();
    }
  }, [isExpanded]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
    }
  }, [messages, isExpanded]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      const currentMessage = message;
      setMessage('');
      await sendMessage(currentMessage);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    if (!loading) {
      setMessage('');
      await sendMessage(suggestion);
    }
  };

  // Toggle expanded state
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && messages.length === 0) {
      loadHistory();
    }
  };

  // Chat bubble component
  const ChatBubble = ({ text, sender, isError }) => (
    <div
      className={`max-w-[80%] rounded-lg p-3 mb-2 ${
        sender === 'user'
          ? 'bg-blue-500 text-white ml-auto rounded-br-none'
          : isError
          ? 'bg-red-100 text-red-800 rounded-bl-none'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
      }`}
    >
      {text}
    </div>
  );

  return (
    <>
      {/* Floating chat button */}
      <button
        onClick={handleToggleExpand}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-20 transition-all duration-300 ${
          isExpanded
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
        }`}
      >
        {isExpanded ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Chat interface */}
      <div
        className={`fixed bottom-24 right-6 w-80 md:w-96 rounded-lg shadow-xl overflow-hidden transition-all duration-300 transform z-20 ${
          isExpanded ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
        }`}
      >
        {/* Chat header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-500 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Ghoomo Assistant</h3>
              <p className="text-xs text-blue-100">Ask me anything about travel</p>
            </div>
            <button
              onClick={clearChat}
              className="ml-auto text-white hover:text-blue-200"
              title="Clear chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat messages */}
        <div className="bg-white dark:bg-gray-800 h-80 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-3"
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
              <p>Hi there! Ask me anything about travel in India or beyond.</p>
              <p className="text-sm mt-2">
                I can help with itineraries, local tips, and more.
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  text={msg.text}
                  sender={msg.sender}
                  isError={msg.isError}
                />
              ))}
              {loading && (
                <div className="flex justify-center my-2">
                  <div className="dot-typing"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-750 p-2 overflow-x-auto whitespace-nowrap">
            <div className="flex space-x-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm whitespace-nowrap"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat input */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-3 border-t dark:border-gray-700">
          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
            <button
              type="submit"
              className={`bg-blue-500 text-white p-2 rounded-r-lg ${
                loading || !message.trim()
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-600'
              }`}
              disabled={loading || !message.trim()}
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatBot;