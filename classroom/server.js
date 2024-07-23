const express = require("express");
const app = express();
const users = require("./routes/user.js")
const posts = require("./routes/post.js")
const session = require("express-session")
const flash = require("connect-flash")
const path = require("path");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//session is middleware hence app.use
app.use(session({ secret: "mysuperecretstring", resave: false, saveUninitialized: true }))  //express-session require secret as it is required in signed-cookies 
//resave:false,saveUninitialized: true  these are express-session options
app.use(flash())


app.get("/test", (req, res) => {
    res.send("test successful")
})

app.get("/reqcount", (req, res) => {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send(`You have visited site ${req.session.count} times`);
})

// how we can store and use one session info of site
app.get("/register", (req, res) => {
    let { name = "anonymaous" } = req.query;
    req.session.name = name;
    req.flash("success", "user registered successfully")
    res.send(name);
})

app.get("/hello", (req, res) => {
    res.locals.successMsg = req.flash("success")
    res.render("page.ejs", { name: req.session.name }) //we are accessing msg with the help of key
})


app.listen(5000, () => {
    console.log("At 5000")
});

