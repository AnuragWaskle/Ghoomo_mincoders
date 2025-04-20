import { createContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Get user token for API requests
          const token = await user.getIdToken();
          
          // Set token in API service
          api.setAuthToken(token);
          
          // Get user details from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            setUserDetails(userDoc.data());
          } else {
            // Create user document if it doesn't exist
            const newUser = {
              uid: user.uid,
              email: user.email,
              name: user.displayName || 'Traveler',
              photoURL: user.photoURL,
              createdAt: new Date().toISOString(),
              quizCompleted: false
            };
            
            await setDoc(doc(db, 'users', user.uid), newUser);
            setUserDetails(newUser);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          setError(error.message);
        }
      } else {
        // Clear user details and token when logged out
        setUserDetails(null);
        api.clearAuthToken();
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      return false;
    }
  };

  // Sign up with email and password
  const signup = async (email, password, name) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        name,
        photoURL: null,
        createdAt: new Date().toISOString(),
        quizCompleted: false
      });
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
      return false;
    }
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // Create user document
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName || 'Traveler',
          photoURL: result.user.photoURL,
          createdAt: new Date().toISOString(),
          quizCompleted: false
        });
      }
      
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message);
      return false;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
      return false;
    }
  };

  // Update user details
  const updateUserProfile = async (data) => {
    try {
      if (!user) return false;
      
      await setDoc(doc(db, 'users', user.uid), {
        ...userDetails,
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      // Update local state
      setUserDetails(prev => ({ ...prev, ...data }));
      
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error.message);
      return false;
    }
  };

  const value = {
    user,
    userDetails,
    loading,
    error,
    login,
    signup,
    logout,
    loginWithGoogle,
    updateUserProfile,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};