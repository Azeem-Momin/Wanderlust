if (process.env.NODE_ENV != "production") { //we use .env file only in the development phase
    require("dotenv").config();             //never upload .env file on github
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(() => {
    console.log('connected to db');
})
    .catch((err) => {
        console.error(err);
    })


const sesssionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //time in miliseconds from the creation of cookie
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,  //to prevent from cross scripting attack
    },
};

app.use(session(sesssionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());  //to authenticate user we wanna authenticate it in single session at once not every time when user navigate through pages hence session is necessary to implement authentication
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //serializeUser means user se related jitne bhi info h usko agr hum session k ander store kr wate h to that is serializing user
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// demo user
app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "helloworld@gmail.com",
        username: "student",
    });
    let registeredUser = await User.register(fakeUser, "password"); //2nd parameter is password of user
    res.send(registeredUser);
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Page Not Found" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});



// app.get("/category", (req, res) => {
//     res.send("Hi");
// })

app.listen(3000, () => {
    console.log("Server is runing on 3000");
});
app.timeout = 120000; // Increase the timeout to 2 minutes