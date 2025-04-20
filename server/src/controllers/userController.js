// src/controllers/userController.js

// Get user profile
exports.getProfile = (req, res) => {
    // For now, just return the user data from the request
    // In a real implementation, you might fetch this from a database
    try {
      // Assuming the authenticate middleware adds user data to req.user
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({ 
        success: true,
        data: user 
      });
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error while retrieving profile' 
      });
    }
  };
  
  // Update user profile
  exports.updateProfile = (req, res) => {
    try {
      // Assuming the authenticate middleware adds user data to req.user
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // In a real implementation, you would update the user in your database
      // For now, just echo back the data that would be updated
      const updatedData = req.body;
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          ...user,
          ...updatedData
        }
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error while updating profile' 
      });
    }
  };