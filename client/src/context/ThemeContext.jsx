import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check if user has a theme preference in localStorage
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme based on stored preference or system preference
  const [darkMode, setDarkMode] = useState(
    storedTheme ? storedTheme === 'dark' : prefersDark
  );
  
  // Apply theme to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  
  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };
  
  // Set specific theme
  const setTheme = (isDark) => {
    setDarkMode(isDark);
  };
  
  const value = {
    darkMode,
    toggleTheme,
    setTheme
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};