const router = require("express").Router();
const passport = require("passport");

// show login page
// router.get("/login", (req,res) =>{
//     res.render("login.ejs", {user: req.user});
// });

// login using Google
router.get("/google", passport.authenticate("google", {scope:["profile","email"]}));

// if login succeed, redirect here
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    // console.log("Login OK, show profile");
    // res.send(req.user);
    res.redirect("/api/checkpage");
});

// logout
router.get("/logout", (req,res) =>{
    req.logOut();
    res.redirect("/api");
});

module.exports = router;