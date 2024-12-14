const User = require("../models/user.js");
const sendEmail = require("./sendEmail.js"); // Import sendEmail utility

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        // Automatically log in the user after signup
        req.login(registeredUser, async (err) => { //login method of passport automatically login user after signup
            if (err) {
                return next(err);
            }

            // Add email-sending functionality here
            const subject = 'Welcome to Wanderlust!';
            const text = `Hi ${username},\n\nThank you for signing up on Wanderlust! We're thrilled to have you as part of our community.\n\nHappy exploring,\nThe Wanderlust Team`;

            try {
                await sendEmail(email, subject, text);
                console.log(`Welcome email sent to: ${email}`);
            } catch (e) {
                console.error('Error sending email:', e);
                req.flash('error', 'Signup successful, but the welcome email could not be sent.');
            }

            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {    
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");

    let redirectUrl = res.locals.redirectUrl || "/listings";
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
