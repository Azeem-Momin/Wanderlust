const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup))

    
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { //passport authenticate wheather this user is presesnt or not
        failureRedirect: "/login",  //if not authenticated then redirect to the same page
        failureFlash: true,  //display flash message if not authenticated
    }),
    userController.login);


router.get("/logout", userController.logout);

module.exports = router;