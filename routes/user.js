
const multer = require('multer');
const path = require('path');
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); //where we want to save file


// Configure Multer for profile picture uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/uploads/profile_pictures'); // Folder where images will be saved
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp as filename to prevent collisions
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit (adjust as needed)

// }); // Define multer instance, no .single() here

// Routes
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(upload.single('profilePicture'), wrapAsync(userController.signup)); // Call .single() here
    // .post(upload.single('profilePicture'), (req,res)=>{
    //     console.log(req.file);
    // }); // Call .single() here

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login", // Redirect if authentication fails
            failureFlash: true, // Show flash message on failure
        }),
        userController.login
    );

router.get("/logout", userController.logout);

router.get('/user/profile', isLoggedIn, wrapAsync(userController.showProfile));

module.exports = router;
