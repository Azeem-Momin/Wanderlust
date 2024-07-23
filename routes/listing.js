const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
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
    // 
    // .post(isLoggedIn, validateListing, upload.single("listing[image]"), wrapAsync(listingController.createListing));
    .post(isLoggedIn,  upload.single("listing[image]"), wrapAsync(listingController.createListing));


// create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);


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

module.exports = router;