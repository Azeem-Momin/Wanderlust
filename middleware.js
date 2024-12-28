const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require('./joiSchema.js');
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}


// module.exports.isLoggedInForLikes = (req, res, next) => {
//     if (!req.isAuthenticated()) {
//         req.session.redirectUrl = req.originalUrl;
//         req.flash("error", "You must be logged in to like listings!");
//         console.log(req.originalUrl);
//         res.locals.currentUserId = null; // No logged-in user
//         // console.log(req.flash("error")); // Should log ["You must be logged in to like listings!"]
//         // console.log(req.user);
//         return res.redirect("/login");
//     } else {
//         res.locals.currentUserId = req.user._id; // Set currentUserId to logged-in user's ID
//         next();
//     }
// };

module.exports.isLoggedInForLikes = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Save the original URL the user tried to access
        req.session.redirectUrl = req.originalUrl;

        // Set flash message for unauthenticated access
        req.flash("error", "You must be logged in to like listings!");
        return res.status(401).json({ redirectUrl: "/login" }); // Send a 401 Unauthorized status code
       
    }

    // If authenticated, set the current user ID in res.locals for use in templates
    res.locals.currentUserId = req.user._id;

    // Proceed to the next middleware or route handler
    next();
};




module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; //since passport has access to req.session.redirectUrl and it will delete redirect url after login by default hence we are using locals coz locals have access to all the files and passport cant delete it
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}