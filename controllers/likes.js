const Listing = require('../models/listing');

module.exports.like = async (req, res) => {
    try {
      const { id } = req.params; // Listing ID
      // console.log("check", req.user);
      const userId = req.user._id; // Assuming user authentication middleware provides req.user
      console.log(userId);
      console.log(req.params);
  
      const listing = await Listing.findById(id);
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
  
      // Add user ID to the likes array if not already present
      if (!listing.likes.includes(userId)) {
        listing.likes.push(userId);
        await listing.save();
      }
  
      res.status(200).json({ message: 'Liked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };


module.exports.unlike = async (req, res) => {
    try {
      const { id } = req.params; // Listing ID
      const userId = req.user._id; // Assuming user authentication middleware provides req.user
  
      const listing = await Listing.findById(id);
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
  
      // Remove user ID from the likes array if present
      listing.likes = listing.likes.filter((id) => id.toString() !== userId.toString());
      await listing.save();
  
      res.status(200).json({ message: 'Unliked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };