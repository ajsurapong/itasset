const router = require("express").Router();
const path = require("path");
const authCheck = require("./authCheck");
const con = require("../config/dbConfig");

//Root Page
router.get("/", (req, res) => {
    // res.sendFile(path.join(__dirname, "../views/index.html"));
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
                        res.render('index', {location: result, year: year-1});
                    }
                })
            } else {
                // this year
                // res.json(result);
                // console.log((result));
                res.render('index', {location: result, year: year});
            }
        }
    });

    // res.render("index");
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
    res.sendFile(path.join(__dirname, "../views/mainpage.html"))
});

//Return User_history page
router.get("/User_history", authCheck, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/User_history.html"))
});

//Return Aseet page
router.get("/asset", authCheck, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/asset.html"))
});

//Return Aseet page
router.get("/announce", authCheck, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/newspage.html"))
});

//Return dashboard page
router.get("/dashboard", authCheck, function (req, res) {
    res.sendFile(path.join(__dirname, "../views/dashboard.html"))
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