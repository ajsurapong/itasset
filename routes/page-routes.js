const router = require("express").Router();
const path = require("path");

//Root Page
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/index.html"));
});

//Return manageUser page
router.get("/checkpage", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/checkpage.html"))
});
router.get("/manageUser", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/manageuser.html"))
});

router.get("/printqrcode", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/printqrcode.html"))
});

router.get("/printbarcode", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/printbarcode.html"))
});

//Return home page
router.get("/mainpage", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/mainpage.html"))
});

//Return User_history page
router.get("/User_history", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/User_history.html"))
});

//Return Aseet page
router.get("/asset", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/asset.html"))
});

//Return Aseet page
router.get("/announce", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/newspage.html"))
});

//Return dashboard page
router.get("/dashboard", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/dashboard.html"))
});

//Return change_disapear page
router.get("/change_disapear", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/change_disapear.html"))
});

//Return Date_manage time page
router.get("/Date_manage", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/Date_manage.html"))
});

//Return Date_managerUser page
router.get("/Date_manageUser", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/Date_manageUser.html"))
});

//Return single item page
router.get("/singleItem", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/singleItem.html"))
});

//Return information page
router.get("/information", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/information.html"))
});


//Return landing1 page
router.get("/takepicture", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/takepicture.html"))
});

//Return adminhistory page
router.get("/adminhistory", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/Admin_history.html"))
});

module.exports = router;