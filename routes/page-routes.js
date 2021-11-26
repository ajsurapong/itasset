require('dotenv').config();
const router = require("express").Router();
const path = require("path");
const authCheck = require("./authCheck");
const con = require("../config/dbConfig");
const jwt = require('jsonwebtoken');
const authCheckAdmin = require('./authCheck-admin');

//Root Page
router.get("/", (req, res) => {
    // check if user has already logged in and the token has not expired
    let bypass = false;
    let userData;
    const token = req.signedCookies['assettoken'];
    // token found?
    if (token) {
        // token correct?
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (!err) {
                bypass = true;
                userData = decoded;
            }
            else {
               console.log(err); 
            }            
        });
    }

    // token is found and correct?
    if (bypass) {
        // jump to main page
        // res.render('mainpage', { user: userData, activeURL: 'mainpage' });
        res.redirect('/api/dashboard');
    }
    else {
        // no token or token is wrong, show normal assets of the latest year in DB
        const sql = "SELECT MAX(Year) AS year FROM item";
        con.query(sql, function (err, resultYear) {
            if (err) {
                console.log(err);
                res.status(503).send("เซิร์ฟเวอร์ฐานข้อมูลไม่ตอบสนอง");
            } else {
                // return the latest year
                res.render('index', { year: resultYear[0].year });
            }
        });
    }
});

//Return manageUser page
router.get("/checkpage", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/checkpage.html"))
});

router.get("/manageUser", authCheck, authCheckAdmin, function (req, res) {
    // res.sendFile(path.join(__dirname, "../views/manageuser.html"))
    // get unique years
    const sql = "SELECT DISTINCT Year FROM year_user ORDER BY Year DESC"
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ฐานข้อมูลไม่ตอบสนอง");
        } else {
            res.render("manageuser", { user: req.decoded, years: result, activeURL: '/api/manageUser' });
        }
    });
});

router.get("/printqrcode", authCheck, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/printqrcode.html"))
});

router.get("/printbarcode", authCheck, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/printbarcode.html"))
});

//Return home page
router.get("/mainpage", authCheck, function (req, res) {
    res.render('mainpage', { user: req.decoded, activeURL: '/api/mainpage' });
});

//Return User_history page
router.get("/User_history", authCheck, function (req, res) {
    res.render("User_history", { user: req.decoded, activeURL: '/api/User_history' });
});

//Return Asset page
router.get("/asset", authCheck, function (req, res) {
    // get unique years
    const sql = "SELECT DISTINCT Year FROM item ORDER BY Year DESC"
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ฐานข้อมูลไม่ตอบสนอง");
        } else {
            res.render("asset", { user: req.decoded, years: result, activeURL: '/api/asset' });
        }
    });    
});

//Return Announce management page
router.get("/announce", authCheck, authCheckAdmin, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/newspage.html"))
});

//Return dashboard page
router.get("/dashboard", authCheck, function (req, res) {
    // get all distinct years for drop down year selection
    const sql = "SELECT DISTINCT Year FROM item ORDER BY Year DESC";
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.render("dashboard", { user: req.decoded, years: result, activeURL: '/api/dashboard' });           
        }
    });
});

//Return change_disapear page
router.get("/change_disapear", authCheck, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/change_disapear.html"))
});

//Return Date_manage time page
router.get("/Date_manage", authCheck, authCheckAdmin, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/Date_manage.html"))
});

//Return Date_managerUser page
router.get("/Date_manageUser", authCheck, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/Date_manageUser.html"))
});

//Return single item page
router.get("/singleItem", authCheck, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/singleItem.html"))
});

//Return information page
router.get("/information", authCheck, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/information.html"))
});


//Return landing1 page
router.get("/takepicture", authCheck, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/takepicture.html"))
});

//Return adminhistory page
router.get("/adminhistory", authCheck, authCheckAdmin, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/Admin_history.html"))
});

module.exports = router;