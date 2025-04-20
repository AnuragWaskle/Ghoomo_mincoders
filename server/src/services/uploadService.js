const { db } = require('../config/firebase');
const admin = require('firebase-admin');

/**
 * Upload a photo to Firebase Storage
 * @param {Object} file - File object
 * @param {string} userId - User ID
 * @param {Object} metadata - Photo metadata
 * @returns {Promise<Object>} - Upload result
 */
const uploadPhoto = async (file, userId, metadata) => {
  try {
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `${userId}_${timestamp}_${file.originalname}`;
    const storagePath = `uploads/${userId}/${filename}`;
    
    // Get storage bucket
    const bucket = admin.storage().bucket();
    
    // Create a file reference
    const fileRef = bucket.file(storagePath);
    
    // Upload the file
    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
        metadata: {
          userId,
          originalName: file.originalname
        }
      }
    });
    
    // Get the download URL
    const [downloadURL] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-01-2500' // Far future expiration
    });
    
    // Create upload document in Firestore
    const uploadId = `upload_${timestamp}`;
    const uploadData = {
      id: uploadId,
      userId,
      filename,
      originalName: file.originalname,
      contentType: file.mimetype,
      size: file.size,
      storagePath,
      downloadURL,
      location: metadata.location || null,
      caption: metadata.caption || '',
      tags: metadata.tags || [],
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    
    await db.collection('uploads').doc(uploadId).set(uploadData);
    
    // Update user's uploads array
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      uploadedPhotos: admin.firestore.FieldValue.arrayUnion(uploadId)
    });
    
    return {
      success: true,
      uploadId,
      downloadURL,
      ...uploadData
    };
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw new Error(`Failed to upload photo: ${error.message}`);
  }
};

/**
 * Get a user's uploads
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - User's uploads
 */
const getUserUploads = async (userId) => {
  try {
    const snapshot = await db.collection('uploads')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting user uploads:', error);
    throw new Error('Failed to get user uploads');
  }
};

/**
 * Get uploads by location
 * @param {string} location - Location name
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} - Uploads for the location
 */
const getUploadsByLocation = async (location, limit = 20) => {
  try {
    const snapshot = await db.collection('uploads')
      .where('location', '==', location)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting uploads by location:', error);
    throw new Error('Failed to get uploads by location');
  }
};

/**
 * Get feed of recent uploads
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} - Feed data
 */
const getFeed = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    
    const snapshot = await db.collection('uploads')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset(offset)
      .get();
    
    const uploads = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const uploadData = doc.data();
        
        // Get user details
        const userDoc = await db.collection('users').doc(uploadData.userId).get();
        const userData = userDoc.data() || {};
        
        return {
          ...uploadData,
          userName: userData.name || 'Anonymous',
          userPhoto: userData.photoURL || null
        };
      })
    );
    
    // Get total count (this is a rough estimate)
    const totalCount = await db.collection('uploads').get();
    
    return {
      uploads,
      pagination: {
        page,
        limit,
        totalCount: totalCount.size,
        totalPages: Math.ceil(totalCount.size / limit)
      }
    };
  } catch (error) {
    console.error('Error getting feed:', error);
    throw new Error('Failed to get feed');
  }
};

module.exports = {
  uploadPhoto,
  getUserUploads,
  getUploadsByLocation,
  getFeed
};