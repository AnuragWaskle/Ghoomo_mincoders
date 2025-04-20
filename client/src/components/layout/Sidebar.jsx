import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

// Icons
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const PlanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const DiscoverIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const ThemeIcon = ({ darkMode }) => (
  darkMode ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  )
);

const Sidebar = ({ isOpen, onClose }) => {
  const { userDetails, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Mobile sidebar backdrop
  const backdropClasses = isOpen 
    ? 'md:hidden fixed inset-0 bg-black bg-opacity-50 z-20' 
    : 'hidden';

  // Sidebar classes
  const sidebarClasses = `fixed md:static inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-900 to-purple-800 text-white transition-transform duration-300 ease-in-out transform ${
    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
  } z-30 flex flex-col h-full`;

  return (
    <>
      {/* Mobile backdrop */}
      <div className={backdropClasses} onClick={onClose} />

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
              Ghoomo
            </span>
          </div>
          <button className="md:hidden text-white" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User profile */}
        {userDetails && (
          <div className="px-4 py-3 mb-6 border-b border-blue-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold">
                {userDetails.photoURL ? (
                  <img 
                    src={userDetails.photoURL} 
                    alt={userDetails.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  userDetails.name?.charAt(0) || 'G'
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{userDetails.name}</p>
                {userDetails.travelPersona && (
                  <p className="text-xs text-blue-300">{userDetails.travelPersona}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-800'
              }`
            }
          >
            <HomeIcon />
            <span className="ml-3">Explore</span>
          </NavLink>

          <NavLink 
            to="/plan" 
            className={({ isActive }) => 
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-800'
              }`
            }
          >
            <PlanIcon />
            <span className="ml-3">Plan Journey</span>
          </NavLink>

          <NavLink 
            to="/discover" 
            className={({ isActive }) => 
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-800'
              }`
            }
          >
            <DiscoverIcon />
            <span className="ml-3">Discover</span>
          </NavLink>

          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-800'
              }`
            }
          >
            <ProfileIcon />
            <span className="ml-3">Profile</span>
          </NavLink>
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-blue-700">
          <button 
            className="flex items-center px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 w-full transition-colors"
            onClick={toggleTheme}
          >
            <ThemeIcon darkMode={darkMode} />
            <span className="ml-3">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button 
            className="flex items-center px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 w-full transition-colors mt-2"
            onClick={handleLogout}
          >
            <LogoutIcon />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;