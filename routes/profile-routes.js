const router = require("express").Router();
const authCheck = require("./authCheck");

router.get("/infouser", authCheck, function (req, res) {
    //console.log(req.user);
    res.send(req.user);
});

module.exports = router;