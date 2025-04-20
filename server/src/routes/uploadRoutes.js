const express = require('express');
const uploadController = require('../controllers/uploadController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Upload a photo
router.post('/photo', uploadController.uploadMiddleware, uploadController.uploadPhoto);

// Get user's uploads
router.get('/user', uploadController.getUserUploads);

// Get uploads by location
router.get('/location/:location', uploadController.getUploadsByLocation);

// Get feed of recent uploads
router.get('/feed', uploadController.getFeed);

// Like an upload
router.post('/:uploadId/like', uploadController.likeUpload);

// Comment on an upload
router.post('/:uploadId/comment', uploadController.commentOnUpload);

// Get comments for an upload
router.get('/:uploadId/comments', uploadController.getComments);

module.exports = router;