const User = require("../models/user.js");
const sendEmail = require("./sendEmail.js"); // Import sendEmail utility


module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};



// original
module.exports.signup = async (req, res, next) => {
    try {
        // Extract data from the request body
        let { username, email, password } = req.body;
        // Create a new user
        let url = req.file.path;
        let filename = req.file.filename;
        // const newUser = new User({ email, username, url, filename });
        const newUser = new User({
            email, username, profilePicture: { url, filename }
        });
        // Register the user with Passport
        const registeredUser = await User.register(newUser, password);

        // Automatically log in the user after signup
        req.login(registeredUser, async (err) => {
            if (err) {
                return next(err);
            }

            // Send a welcome email
            const subject = 'Welcome to Wanderlust!';
            const text = `Hi ${username},\n\nThank you for signing up on Wanderlust! We're thrilled to have you as part of our community.\n\nHappy exploring,\nMohammad Azeem Momin`;

            try {
                await sendEmail(email, subject, text);
            } catch (e) {
                console.error('Error sending email:', e);
                req.flash('error', 'Signup successful, but the welcome email could not be sent.');
            }

            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};






module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");

    // Get the redirect URL from res.locals or default to '/listings'
    let redirectUrl = res.locals.redirectUrl || "/listings";

    // Check if the redirect URL is '/listings/:id/like' and change it to '/listings'
    if (redirectUrl.includes('/listings/') && redirectUrl.includes('/like')) {
        redirectUrl = '/listings';
    }

    // Redirect the user to the determined URL
    res.redirect(redirectUrl);
};


module.exports.logout = (req, res, next) => {
    req.logout((err) => {  //logout is built-in method that takes callback as argument
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
};


// profile page
module.exports.showProfile = async (req, res) => {
    let { id } = req.user;
    // const user = await User.findById(id).populate("listings");
    const user = await User.findById(id);
    // console.log("profile");
    res.render("users/profile.ejs", { user });
    // res.render("listings/profile.ejs");
};

