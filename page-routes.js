const app = require("express").Router();
const path = require("path");

//Root Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

//Return manageUser page
app.get("/checkpage", function (req, res) {
    res.sendFile(path.join(__dirname, "checkpage.html"))
});
app.get("/manageUser", function (req, res) {
    res.sendFile(path.join(__dirname, "manageUser.html"))
});

app.get("/printqrcode", function (req, res) {
    res.sendFile(path.join(__dirname, "printqrcode.html"))
});

app.get("/printbarcode", function (req, res) {
    res.sendFile(path.join(__dirname, "printbarcode.html"))
});

//Return home page
app.get("/mainpage", function (req, res) {
    res.sendFile(path.join(__dirname, "mainpage.html"))
});

//Return User_history page
app.get("/User_history", function (req, res) {
    res.sendFile(path.join(__dirname, "User_history.html"))
});

//Return Aseet page
app.get("/asset", function (req, res) {
    res.sendFile(path.join(__dirname, "asset.html"))
});

//Return Aseet page
app.get("/announce", function (req, res) {
    res.sendFile(path.join(__dirname, "newspage.html"))
});

//Return dashboard page
app.get("/dashboard", function (req, res) {
    res.sendFile(path.join(__dirname, "dashboard.html"))
});

//Return change_disapear page
app.get("/change_disapear", function (req, res) {
    res.sendFile(path.join(__dirname, "change_disapear.html"))
});

//Return Date_manage time page
app.get("/Date_manage", function (req, res) {
    res.sendFile(path.join(__dirname, "Date_manage.html"))
});

//Return Date_managerUser page
app.get("/Date_manageUser", function (req, res) {
    res.sendFile(path.join(__dirname, "Date_manageUser.html"))
});

//Return single item page
app.get("/singleItem", function (req, res) {
    res.sendFile(path.join(__dirname, "singleItem.html"))
});

//Return information page
app.get("/information", function (req, res) {
    res.sendFile(path.join(__dirname, "information.html"))
});


//Return landing1 page
app.get("/takepicture", function (req, res) {
    res.sendFile(path.join(__dirname, "takepicture.html"))
});

//Return adminhistory page
app.get("/adminhistory", function (req, res) {
    res.sendFile(path.join(__dirname, "Admin_history.html"))
});

module.exports = app;