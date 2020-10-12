require('dotenv').config();

//<=========== Import packages ==========>
const compression = require("compression");
const express = require("express");
const path = require("path");
const body_parser = require("body-parser");

// const helmet = require("helmet");        //FIXME: Cross-site scripting is used, cannot use helmet, fix later!

const pageRoutes = require("./page-routes");
const otherRoutes = require("./routes/other-routes");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");

require("./config/passport-setup");
const passport = require("passport");
const cookieSession = require("cookie-session");
const key = require("./config/key");
// const xlsx = require("xlsx");

const app = express();

app.use('/Image', express.static('./upload/Image'));

//<=========== Middleware ==========>
app.use(compression());
// app.use(helmet());
app.use(body_parser.urlencoded({ extended: true })); //when you post service
app.use(body_parser.json());
//cookie
app.use(cookieSession({
    maxAge: 1000 * 60 * 60,
    keys: [key.cookie.secret]
}));
// init passport for se/derialization
app.use(passport.initialize());
// session
app.use(passport.session());

// app.use("/img", express.static(path.join(__dirname, 'img')));
// app.use("/img1", express.static(path.join(__dirname, '../mobile/assets/img')));
// app.use("/style.css", express.static(path.join(__dirname, 'style.css')));
app.use("/upload", express.static(path.join(__dirname, 'upload')));
app.use("/assets", express.static(path.join(__dirname, 'assets')));
app.use("/JS_Files", express.static(path.join(__dirname, 'JS_Files')));

// =========== Services (authen) ===========
// authen
app.use("/auth", authRoutes);

// profle
app.use("/profile", profileRoutes);
// =========== Services (Page loading) ===========
app.use(pageRoutes);
// =========== Services (Others) ===========
app.use(otherRoutes);

// 500 error
app.use(function (err, req, res, next) {
    // console.error(err.stack);
    res.status(500).send('มีความผิดพลาดจากเครื่องแม่ข่าย กรุณารอและทดสอบใหม่อีกครั้ง');
  })
  
// 404 error
app.use(function(req, res, next) {
    res.status(404).send('ไม่พบหน้าที่คุณต้องการ');
  });

// ========== Starting server ============
const PORT = process.env.PORT;
app.listen(PORT, function () {
    console.log("Server is running at " + PORT);
});