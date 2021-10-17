require('dotenv').config();
const router = require("express").Router();
const path = require("path");
const authCheck = require("./authCheck");
const con = require("../config/dbConfig");
const jwt = require('jsonwebtoken');

//Root Page
router.get("/", (req, res) => {
    // res.sendFile(path.join(__dirname, "../views/index.html"));
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
        res.render('mainpage', { user: userData, activeURL: 'mainpage' });
    }
    else {
        // no token or token is wrong, show normal assets of this year or last year
        // get all asset locations of this year
        const year = new Date().getFullYear() + 543;
        const sql = "SELECT DISTINCT Location FROM item WHERE Status = 1 AND Year = ?"
        con.query(sql, [year], function (err, result) {
            if (err) {
                console.log(err);
                res.status(503).send("เซิร์ฟเวอร์ฐานข้อมูลไม่ตอบสนอง");
            } else {
                // if the current year has no asset info yet
                if (result.length == 0) {
                    // get last year asset info instead
                    con.query(sql, [year - 1], function (err, result) {
                        if (err) {
                            console.log(err);
                            res.status(503).send("เซิร์ฟเวอร์ฐานข้อมูลไม่ตอบสนอง");
                        } else {
                            // previous year
                            // res.json(result);
                            // console.log((result));
                            res.render('index', { location: result, year: year - 1 });
                        }
                    })
                } else {
                    // this year
                    // res.json(result);
                    // console.log((result));
                    res.render('index', { location: result, year: year });
                }
            }
        });
    }
});

//Return manageUser page
router.get("/checkpage", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/checkpage.html"))
});

router.get("/manageUser", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/manageuser.html"))
});

router.get("/printqrcode", authCheck, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/printqrcode.html"))
});

router.get("/printbarcode", authCheck, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/printbarcode.html"))
});

//Return home page
router.get("/mainpage", authCheck, function (req, res) {
    // console.log(req.decoded);
    // res.sendFile(path.join(__dirname, "../views/mainpage.html"))
    res.render('mainpage', { user: req.decoded, activeURL: 'mainpage' });
});

//Return User_history page
router.get("/User_history", authCheck, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/User_history.html"))
});

//Return Asset page
router.get("/asset", authCheck, function (req, res) {
    // res.sendFile(path.join(__dirname, "../views/asset.html"))
    res.render("asset", { user: req.decoded, activeURL: 'asset' });
});

//Return Aseet page
router.get("/announce", authCheck, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/newspage.html"))
});

//Return dashboard page
router.get("/dashboard", authCheck, function (req, res) {
    // res.sendFile(path.join(__dirname, "../views/dashboard.html"))
    // get all distinct years for drop down year selection
    let sql = "SELECT DISTINCT Year FROM item ORDER BY Year DESC";
    con.query(sql, function (err, resultYear) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            // get dashboard info: total items, normal items, lost items, degraded items of current year
            // sql = "SELECT COUNT(Year) FROM item WHERE Year = year(CURDATE())+543";
            // sql = "SELECT COUNT(Year) FROM `item` WHERE Year = year(CURDATE())+543 AND Status = 1";
            // sql = "SELECT COUNT(Year) FROM `item` WHERE Year = year(CURDATE())+543 AND Status = 0";
            // sql = "SELECT COUNT(Year) FROM `item` WHERE Year = year(CURDATE())+543 AND Status = 2";
            sql = "SELECT * FROM (SELECT COUNT(Year) AS normal FROM `item` WHERE Year = year(CURDATE())+543 AND Status = 1) AS rNormal, (SELECT COUNT(Year) AS lost FROM `item` WHERE Year = year(CURDATE())+543 AND Status = 0) AS rLost, (SELECT COUNT(Year) AS degraded FROM `item` WHERE Year = year(CURDATE())+543 AND Status = 2) AS rDegraded";

            con.query(sql, function (err, resultDashboard) {
                if (err) {
                    console.log(err);
                    res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
                }
                else {
                    // console.log(resultDashboard);               
                    res.render("dashboard", { user: req.decoded, years: resultYear, dashboard: resultDashboard, activeURL: 'dashboard' });
                }
            });
            // res.json(result)            
        }
    });
});

//Return change_disapear page
router.get("/change_disapear", authCheck, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/change_disapear.html"))
});

//Return Date_manage time page
router.get("/Date_manage", authCheck, function (req, res) {
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
router.get("/adminhistory", authCheck, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/Admin_history.html"))
});

module.exports = router;