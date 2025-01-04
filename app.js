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
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const cron = require('node-cron');
const User = require("./models/user.js");
const Booking = require('./models/booking');

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const likeRoutes = require('./routes/likes'); 
const bookingRoutes = require('./routes/bookings');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const mongoUrl = "mongodb://localhost:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;


async function main() {
    // await mongoose.connect(dbUrl);
    await mongoose.connect(mongoUrl);
}

main().then(() => {
    console.log('connected to db');
})
    .catch((err) => {
        console.error(err);
    })


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in the MONGO STORE", err);
})

const sesssionOptions = {
    store,
    secret: process.env.SECRET,
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
    res.locals.currentUserId = req.isAuthenticated() ? req.user._id : null; // Highlighted middleware
    // console.log("Current User ID:", res.locals.currentUserId); // Debugging
    next();
})


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/listings", likeRoutes);
app.use("/listings", bookingRoutes);


app.use("/", userRouter);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Page Not Found" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});



cron.schedule('0 0 * * *', async () => {
    // console.log("Cron job running for timezone check:", new Date());
    const now = new Date();
    await Booking.updateMany({ endDate: { $lt: now }, status: 'active' }, { status: 'completed' });
}, {
    timezone: "Asia/Kolkata" // Replace with your time zone
});


app.listen(3000, () => {
    console.log("Server is runing on 3000");
});
app.timeout = 120000; // Increase the timeout to 2 minutes