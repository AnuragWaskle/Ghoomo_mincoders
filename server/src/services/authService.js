const { auth, db } = require('../config/firebase');

/**
 * Create a new user in Firebase Auth and Firestore
 */
const createUser = async (email, password, name) => {
  // Create user in Firebase Auth
  const userRecord = await auth.createUser({
    email,
    password,
    displayName: name,
  });
  
  // Create user document in Firestore
  await db.collection('users').doc(userRecord.uid).set({
    uid: userRecord.uid,
    email,
    name,
    createdAt: new Date().toISOString(),
    photoURL: null,
    travelPersona: null,
    preferences: {},
    completedTrips: [],
  });
  
  return userRecord;
};

/**
 * Get user by email
 */
const getUserByEmail = async (email) => {
  const userRecord = await auth.getUserByEmail(email);
  return userRecord;
};

/**
 * Get user by UID
 */
const getUserById = async (uid) => {
  const userRecord = await auth.getUser(uid);
  return userRecord;
};

/**
 * Update user profile
 */
const updateUserProfile = async (uid, userData) => {
  // Update in Auth if applicable fields are present
  const authUpdateData = {};
  if (userData.displayName) authUpdateData.displayName = userData.displayName;
  if (userData.photoURL) authUpdateData.photoURL = userData.photoURL;
  
  if (Object.keys(authUpdateData).length > 0) {
    await auth.updateUser(uid, authUpdateData);
  }
  
  // Update in Firestore
  const userRef = db.collection('users').doc(uid);
  await userRef.update({
    ...userData,
    updatedAt: new Date().toISOString()
  });
  
  return await userRef.get();
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserProfile
};