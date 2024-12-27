const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isLoggedInForLikes, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");  //for parsing form's data
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); //where we want to save file


// this when we have diff req on the same route. Compact form of writing code
router
  .route("/")
  // Index route --> show all listings
  .get(wrapAsync(listingController.index))
  // create route
  .post(isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.createListing));


// create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// to create heart icon
// router.get("/:id/unlike", isLoggedInForLikes, listingController.likes);


// Like a listing
router.post('/:id/like', isLoggedInForLikes, async (req, res) => {
  try {
    const { id } = req.params; // Listing ID
    const userId = req.user._id; // Assuming user authentication middleware provides req.user

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

});


// Unlike a listing
router.post('/:id/unlike', isLoggedInForLikes, async (req, res) => {
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
});



// searching listings based on country
router.get("/search", wrapAsync(listingController.searchListing));


// show route
router.get("/:id", wrapAsync(listingController.showListing));

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) //show route
  .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing,  //update route
    wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); //delete route


// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editNewForm));


// to show listing based on category
// Add new route for filtering by category
router.get('/categories/category', wrapAsync(async (req, res) => {
  let { category } = req.query;
  const allListings = await Listing.find({ category: category });
  // console.log(allListings);
  res.render('listings/category', { allListings });
  // res.send("hi");
}));

// router.get("/listings/")


module.exports = router;