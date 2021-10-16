const router = require("express").Router();
// const passport = require("passport");
const bcrypt = require('bcrypt');
const con = require('../config/dbConfig');
const jwt = require('jsonwebtoken');

// login using Google
// router.get("/google", passport.authenticate("google", {scope:["profile","email"]}));

// if login succeed, redirect here
// router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
//     // console.log("Login OK, show profile");
//     // res.send(req.user);
//     res.redirect("/api/checkpage");
// });

// logout from Google
// router.get("/logout", (req,res) => {
//     req.logOut();
//     res.redirect("/api");
// });

// login using own db
router.post('/signin', (req, res) => {
    const { username, password } = req.body;
    const year = new Date().getFullYear() + 543;

    const sql = 'SELECT Name, Password FROM year_user WHERE Email_user = ? AND Year = ?';
    con.query(sql, [username, year], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Database server error');
        }
        if (result.length != 1) {
            return res.status(400).send('Username does not exist');
        }
        //check password
        bcrypt.compare(password, result[0].Password, (err, same) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Authen server error');
            }
            if (same) {
                //create JWT
                const payload = { name: result[0].Name, email: username, year: year};
                const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '7d' });

                // save token to client's cookie
                const cookieOption = {
                    maxAge: 7 * 24 * 60 * 60 * 1000,    //ms
                    httpOnly: true,
                    signed: true
                };
                res.cookie('assettoken', token, cookieOption);
                res.send('/api/mainpage');
            }
            else {
                res.status(400).send("Wrong password");
            }
        });
    });
});

// --- log out ---
router.get('/signout', (req, res) => {
    // remove token cookie
    res.clearCookie('assettoken');
    res.redirect('/api');
});

// --- generate hash password ---
router.get('/password/:pass', (req, res) => {
    const pass = req.params.pass;
    bcrypt.hash(pass, 10, (err, hash) => {
        if (err) {
            console.log(err);
            res.status(500).send("Hashing error");
        }
        else {
            res.send(hash);
        }
    });
});

module.exports = router;