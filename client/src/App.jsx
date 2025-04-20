import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layout components
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import Home from './pages/Home';
import PlanJourney from './pages/PlanJourney';
import Itinerary from './pages/Itinerary';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Quiz from './pages/Quiz';
import NotFound from './pages/NotFound';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Quiz completion check
const QuizCompletionCheck = ({ children }) => {
  const { user, userDetails } = useAuth();
  const location = useLocation();

  // If quiz is not completed and not on quiz page, redirect to quiz
  if (user && userDetails && !userDetails.quizCompleted && location.pathname !== '/quiz') {
    return <Navigate to="/quiz" replace />;
  }

  return children;
};

function App() {
  const { user, loading } = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Initialize app after authentication state is determined
    if (!loading) {
      setAppReady(true);
    }
  }, [loading]);

  if (!appReady) {
    return <div className="loading-screen">Loading Ghoomo...</div>;
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" replace />} />
      </Route>

      {/* Protected routes */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/quiz" element={<Quiz />} />
        
        {/* Routes that require quiz completion */}
        <Route element={<QuizCompletionCheck />}>
          <Route path="/" element={<Home />} />
          <Route path="/plan" element={<PlanJourney />} />
          <Route path="/itinerary/:id" element={<Itinerary />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/profile/:id?" element={<Profile />} />
        </Route>
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;