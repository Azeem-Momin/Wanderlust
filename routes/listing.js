const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");  //for parsing form's data
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); //where we want to save file
const Booking = require('../models/booking');


// this when we have diff req on the same route. Compact form of writing code
router
  .route("/")
  // Index route --> show all listings
  .get(wrapAsync(listingController.index))
  // create route
  .post(isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.createListing));


// create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);


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


// booking listing
router.get("/:id/book", isLoggedIn, wrapAsync(listingController.bookListing));


// to show listing based on category
router.get('/categories/category', wrapAsync(listingController.category));


//show owned listings
router.get('/user/owned', isLoggedIn, wrapAsync(listingController.ownedListings));


//show liked listings
router.get('/user/liked', isLoggedIn, wrapAsync(listingController.likedListings));


//show booked listings
router.get('/user/booked', isLoggedIn, wrapAsync(listingController.bookedListings));


// show reviews of a user
router.get('/user/reviews', isLoggedIn, wrapAsync(listingController.userReviews));


router.get('/about', (req, res) => {
  res.render('about');
});

module.exports = router;