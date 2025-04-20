const { auth, db } = require('../config/firebase');
const authService = require('../services/authService');

/**
 * Register a new user
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }
    
    const userRecord = await authService.createUser(email, password, name);
    
    return res.status(201).json({
      message: 'User registered successfully',
      userId: userRecord.uid
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 'auth/email-already-exists' || error.code === 'auth/email-already-in-use') {
      return res.status(409).json({ message: 'Email is already in use' });
    }
    
    next(error);
  }
};

/**
 * Login user
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // This endpoint is primarily for validation
    // Actual authentication happens on the client side with Firebase SDK
    const userRecord = await authService.getUserByEmail(email);
    
    return res.status(200).json({
      message: 'Credentials valid',
      userId: userRecord.uid
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    next(error);
  }
};

/**
 * Get current user
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    // User data is already attached by the authenticate middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    return res.status(200).json({
      user: {
        uid: req.user.uid,
        email: req.user.email,
        ...req.userData
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 */
exports.logout = async (req, res, next) => {
  try {
    // Firebase handles token invalidation on the client side
    // This endpoint is primarily for server-side operations related to logout
    
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};