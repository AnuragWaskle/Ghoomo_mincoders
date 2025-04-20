const uploadService = require('../services/uploadService');
const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/quicktime'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and MP4 files are allowed.'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Middleware for handling file uploads
exports.uploadMiddleware = upload.single('file');

/**
 * Upload a photo
 */
exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      });
    }
    
    const userId = req.user.uid;
    const { location, caption, tags } = req.body;
    
    // Parse tags if provided
    const parsedTags = tags ? JSON.parse(tags) : [];
    
    // Upload the photo
    const result = await uploadService.uploadPhoto(req.file, userId, {
      location,
      caption,
      tags: parsedTags
    });
    
    return res.status(201).json({
      message: 'Photo uploaded successfully',
      upload: result
    });
  } catch (error) {
    console.error('Error in uploadPhoto:', error);
    
    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({ message: error.message });
    }
    
    next(error);
  }
};

/**
 * Get user's uploads
 */
exports.getUserUploads = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    
    const uploads = await uploadService.getUserUploads(userId);
    
    return res.status(200).json({
      uploads
    });
  } catch (error) {
    console.error('Error in getUserUploads:', error);
    next(error);
  }
};

/**
 * Get uploads by location
 */
exports.getUploadsByLocation = async (req, res, next) => {
  try {
    const { location } = req.params;
    const { limit } = req.query;
    
    const uploads = await uploadService.getUploadsByLocation(
      location,
      limit ? parseInt(limit) : 20
    );
    
    return res.status(200).json({
      uploads
    });
  } catch (error) {
    console.error('Error in getUploadsByLocation:', error);
    next(error);
  }
};

/**
 * Get feed of recent uploads
 */
exports.getFeed = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const feed = await uploadService.getFeed(
      parseInt(page),
      parseInt(limit)
    );
    
    return res.status(200).json(feed);
  } catch (error) {
    console.error('Error in getFeed:', error);
    next(error);
  }
};

/**
 * Like an upload
 */
exports.likeUpload = async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    const userId = req.user.uid;
    
    const result = await uploadService.likeUpload(uploadId, userId);
    
    return res.status(200).json({
      message: result.liked ? 'Upload liked' : 'Upload unliked',
      ...result
    });
  } catch (error) {
    console.error('Error in likeUpload:', error);
    next(error);
  }
};

/**
 * Comment on an upload
 */
exports.commentOnUpload = async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    const { text } = req.body;
    const userId = req.user.uid;
    
    if (!text) {
      return res.status(400).json({
        message: 'Comment text is required'
      });
    }
    
    const comment = await uploadService.commentOnUpload(uploadId, userId, text);
    
    return res.status(201).json({
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    console.error('Error in commentOnUpload:', error);
    next(error);
  }
};

/**
 * Get comments for an upload
 */
exports.getComments = async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    
    const comments = await uploadService.getComments(uploadId);
    
    return res.status(200).json({
      comments
    });
  } catch (error) {
    console.error('Error in getComments:', error);
    next(error);
  }
};