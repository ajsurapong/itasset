const router = require("express").Router();
const moment = require('moment');
const multer = require("multer");
const con = require("../config/dbConfig");

// Upload image
const storageOptionpic = multer.diskStorage({
    destination: function (req, file, cb) {
        //the folder is relative to app.js
        cb(null, './upload/Image');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

router.post('/login', function (req, res) {
    const { email } = req.body;
    const currentYear = new Date().getFullYear() + 543;
    const sql = 'SELECT * FROM year_user where Email_user = ? AND Year = ?';
    con.query(sql, [email, currentYear], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send('DB server error');
        }
        if (result.length == 0) {
            res.status(403).send('No user');
        }
        else {
            res.send(result);
        }
    });
})

router.get('/get_product/:id', function (req, res) {
    const product_code = req.params.id;
    const sql = 'SELECT item.Asset_Number, item.Inventory_Number, item.Asset_Description, item.Takepicture, DATE_FORMAT(item.Received_date , "%Y-%m-%d") AS product_receivedate, item.Year, item.Image, DATE_FORMAT(item.Date_scan , "%Y-%m-%d") AS product_editdate, item.Email_Committee AS name_editor, item.Location ,item.Room ,item.Cost_center ,item.Department , item.Status FROM item WHERE item.Inventory_Number = ? AND item.Year = (YEAR(CURDATE()))+543'
    con.query(sql, product_code, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send('Database server error');
        }
        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('ไม่พบข้อมูล');
        }
    });
});


router.get('/get_productfromotheryear/:id', function (req, res) {
    const product_code = req.params.id;
    const sql1 = 'SELECT DISTINCT Year FROM item ORDER BY Year DESC'
    con.query(sql1, function (err, result1) {
        const sql2 = 'SELECT item.Asset_Number, item.Inventory_Number, item.Asset_Description, item.Takepicture, DATE_FORMAT(item.Received_date , "%Y-%m-%d") AS product_receivedate, item.Year, item.Image, DATE_FORMAT(item.Date_scan , "%Y-%m-%d") AS product_editdate, item.Email_Committee AS name_editor, item.Location ,item.Room ,item.Cost_center ,item.Department , item.Status FROM item WHERE item.Inventory_Number = ? AND item.Year = ?'
        con.query(sql2, [product_code, result1[0].Year], function (err, result2) {
            if (err) {
                console.log(err);
                res.status(500).send('Database server error');
            }
            if (result2.length > 0) {
                res.json(result2);
            } else {
                res.send('ไม่พบข้อมูล');
            }
        });
    });
});

router.get('/check_date/:code', function (req, res) {
    const product_code = req.params.code;
    const currectDate = moment().add(543, 'years').format('YYYY-MM-DD');
    const sql = 'SELECT DATE_FORMAT(Date_start , "%Y-%m-%d") AS start_date , DATE_FORMAT(Date_end , "%Y-%m-%d") AS stop_date , item.Status FROM date_check , item WHERE date_check.Years = (year(CURDATE()))+543 AND item.Inventory_Number = ? AND item.Year = (year(CURDATE()))+543';
    con.query(sql, product_code, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send('Database server error');
        } else {
            if (result.length == 0) {
                res.send('3'); // don't have product id  
                // console.log('3')
            }
            if (result.length > 0) {
                if (currectDate >= result[0].start_date && currectDate <= result[0].stop_date && result[0].Status == 0) {
                    res.send('1'); // 1 is can edit  
                    // console.log("Can Edit")                  
                } else {
                    res.send('2'); // 2 is can see only bacause current date more than end_date in database   
                    // console.log("See only")                 
                }
            }
        }
    });
});

router.get('/home_chart', function (req, res) {
    // let sql = 'SELECT date_check.*,(SELECT COUNT(*) FROM item WHERE Status = 0 AND Year = (year(CURDATE()))+543) AS defaultStatus ,(SELECT COUNT(*) FROM item WHERE Status = 1 AND Year = (year(CURDATE()))+543) AS product_normal ,(SELECT COUNT(*) FROM item WHERE Status = 2 AND Year = year(CURDATE())+543) AS product_repair FROM item,date_check WHERE date_check.Years = (year(CURDATE()))+543 GROUP BY status';

    const sql = 'SELECT one.*, two.*, three.*, four.* FROM (SELECT * FROM date_check WHERE Years = (year(CURDATE()))+543) AS one, (SELECT COUNT(Inventory_Number) AS defaultStatus FROM item WHERE Status = 0 AND Year = (year(CURDATE()))+543) AS two, (SELECT COUNT(Inventory_Number) AS product_normal FROM item WHERE Status = 1 AND Year = (year(CURDATE()))+543) AS three, (SELECT COUNT(Inventory_Number) AS product_repair FROM item WHERE Status = 2 AND Year = (year(CURDATE()))+543) AS four';

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database server error");
        } else {
            res.json(result);
        }
    });
});

var uploadpic = multer({ storage: storageOptionpic }).single("photo");
router.post('/uploadWithImage', function (req, res) {
    uploadpic(req, res, err => {
        if (err) {
            console.log("upload error: " + err);
            res.status(500).send('Upload error');
        } else {
            const data = JSON.parse(req.body.data)
            const path_image = req.file.originalname;
            // console.log(path_image)
            const product_editDate = data.product_editorDate;
            const user_editor = data.user_editor;
            const product_statusID = data.product_statusID;
            const product_code = data.product_code;
            const product_location = data.product_location;
            const product_room = data.product_room;
            const sql = 'UPDATE item SET item.Image = ? , item.Date_scan = ? , item.Email_Committee = ?, item.Status = ?, item.Location =?, item.Room = ? WHERE item.Inventory_Number = ? AND item.Year = (YEAR(CURDATE()))+543';
            con.query(sql, [path_image, product_editDate, user_editor, product_statusID, product_location, product_room,product_code], function (err, result) {
                if (err) {
                    console.log("sql " + err);
                    res.status(500).send("Database server error");
                }
                else {
                    res.send('Upload done');
                }
            })
        }
    });
});

router.post('/uploadNoImage', function (req, res) {
    const product_editDate = req.body.product_data.product_editorDate;
    const user_editor = req.body.product_data.user_editor;
    const product_statusID = req.body.product_data.product_statusID;
    const product_code = req.body.product_data.product_code;
    const product_location = req.body.product_data.product_location;
    const product_room = req.body.product_data.product_room;
    const sql = 'UPDATE item SET item.Date_scan = ? , item.Email_Committee = ?, item.Status = ?, item.Location =?, item.Room = ? WHERE  item.Inventory_Number = ? AND item.Year = (YEAR(CURDATE()))+543';
    con.query(sql, [product_editDate, user_editor, product_statusID, product_location, product_room, product_code], function (err, result) {
        if (err) {
            console.log("sql " + err);
            res.status(500).send("Database server error");
        } else {
            res.send('Upload done');
        }
    });
})

router.put('/keepusername', function (req, res) {
    const currentYear = new Date().getFullYear() + 543;
    const { email, name } = req.body;
    const sql = 'UPDATE year_user SET Name = ? where Email_user = ? AND Year = ?';
    con.query(sql, [name, email, currentYear], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database server error");
        }
        else if (result.affectedRows != 1) {
            res.status(500).send('Update failed');
        }
        else {
            res.send('Update done');
        }
    });
});

module.exports = router;