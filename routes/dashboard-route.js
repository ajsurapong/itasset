const router = require("express").Router();
const con = require("../config/dbConfig");
const authCheck = require("./authCheck");

router.get("/stat/:year", authCheck, function (req, res) {
    const year = req.params.year;
    const sql = "SELECT * FROM ((SELECT COUNT(Year) AS normal FROM `item` WHERE Year = ? AND Status = 1) AS rNormal, (SELECT COUNT(Year) AS lost FROM `item` WHERE Year = ? AND Status = 0) AS rLost, (SELECT COUNT(Year) AS degraded FROM `item` WHERE Year = ? AND Status = 2) AS rDegraded)";

    con.query(sql, [year, year, year], function (err, result) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        }
        else {
            res.json(result);
        }
    });
});

module.exports = router;