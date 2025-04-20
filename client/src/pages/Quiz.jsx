import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const { updateUserProfile } = useAuth();
  const navigate = useNavigate();

  // Fetch quiz questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await api.quiz.getQuestions();
        setQuestions(response.data.questions);
        
        // Initialize answers object
        const initialAnswers = {};
        response.data.questions.forEach(q => {
          initialAnswers[q.id] = q.allowMultiple ? [] : '';
        });
        setAnswers(initialAnswers);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quiz questions:', err);
        setError('Failed to load quiz questions. Please try again.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Update progress when current question changes
  useEffect(() => {
    if (questions.length > 0) {
      setProgress(((currentQuestion + 1) / questions.length) * 100);
    }
  }, [currentQuestion, questions.length]);

  // Handle option selection
  const handleOptionSelect = (questionId, optionId) => {
    const question = questions.find(q => q.id === questionId);
    
    if (question.allowMultiple) {
      // For multiple selection questions
      setAnswers(prev => {
        const currentSelections = [...prev[questionId]];
        
        // Toggle selection
        if (currentSelections.includes(optionId)) {
          return {
            ...prev,
            [questionId]: currentSelections.filter(id => id !== optionId)
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentSelections, optionId]
          };
        }
      });
    } else {
      // For single selection questions
      setAnswers(prev => ({
        ...prev,
        [questionId]: optionId
      }));
      
      // Auto-advance to next question after a short delay
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
        }
      }, 500);
    }
  };

  // Navigate to next/previous question
  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // Submit quiz answers
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      // Check if all questions are answered
      const unanswered = Object.entries(answers).filter(([questionId, answer]) => {
        if (Array.isArray(answer)) {
          return answer.length === 0;
        }
        return !answer;
      });
      
      if (unanswered.length > 0) {
        setError('Please answer all questions before submitting.');
        setSubmitting(false);
        return;
      }
      
      // Submit answers to backend
      const response = await api.quiz.submitResponses(answers);
      
      // Update user profile with travel persona
      await updateUserProfile({
        travelPersona: response.data.analysis.primaryPersona,
        secondaryPersona: response.data.analysis.secondaryPersona,
        preferences: {
          budgetSensitivity: response.data.analysis.budgetSensitivity,
          interests: response.data.analysis.interests,
          preferredActivities: response.data.analysis.preferredActivities,
          travelPace: response.data.analysis.travelPace
        },
        quizCompleted: true,
        quizCompletedAt: new Date().toISOString()
      });
      
      // Navigate to home page
      navigate('/');
      
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading quiz...</p>
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-lg text-center">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <p className="text-gray-600 dark:text-gray-400">No quiz questions available.</p>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Let's Get to Know Your Travel Style
          </h1>

          {error && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {currentQuestion + 1}. {currentQuestionData.text}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {currentQuestionData.allowMultiple
                ? 'Select all that apply'
                : 'Select one option'}
            </p>

            <div className="space-y-3">
              {currentQuestionData.options.map((option) => {
                const isSelected = currentQuestionData.allowMultiple
                  ? answers[currentQuestionData.id]?.includes(option.id)
                  : answers[currentQuestionData.id] === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(currentQuestionData.id, option.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                        : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 mr-3 flex-shrink-0 rounded-full border ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400'
                            : 'border-gray-400 dark:border-gray-600'
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-900 dark:text-white">
                        {option.text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md ${
                currentQuestion === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Previous
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={goToNextQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 ${
                  submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? 'Submitting...' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;