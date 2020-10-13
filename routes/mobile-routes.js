const router = require("express").Router();
const moment = require('moment');
const multer = require("multer");
const mysql = require("mysql");
const config = require("../config/dbConfig.js");
const con = mysql.createConnection(config);

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
    let { email } = req.body;
    let sql = 'SELECT * FROM year_user where Email_user = ? ORDER BY Year DESC';
    con.query(sql, email, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result.length == 0) {
            res.status(403).end();
        }
        else {
            res.send(result).end();
        }
    });
})

router.get('/get_product/:id', function (req, res) {
    let product_code = req.params.id;
    let sql = 'SELECT item.Asset_Number, item.Inventory_Number, item.Asset_Description, item.Takepicture, DATE_FORMAT(item.Received_date , "%Y-%m-%d") AS product_receivedate, item.Year, item.Image, DATE_FORMAT(item.Date_scan , "%Y-%m-%d") AS product_editdate, item.Email_Committee AS name_editor, item.Location ,item.Room ,item.Cost_center ,item.Department , item.Status FROM item WHERE item.Inventory_Number = ? AND item.Year = (YEAR(CURDATE()))+543'
    con.query(sql, product_code, function (err, result) {
        if (err) {
            res.status(404).end();
        }
        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('ไม่พบข้อมูล').end();
        }
    });
});


router.get('/get_productfromotheryear/:id', function (req, res) {
    let product_code = req.params.id;
    let sql2 = 'SELECT DISTINCT Year FROM item ORDER BY Year DESC'
    con.query(sql2, function (err, result1) {


        let sql = 'SELECT item.Asset_Number, item.Inventory_Number, item.Asset_Description, item.Takepicture, DATE_FORMAT(item.Received_date , "%Y-%m-%d") AS product_receivedate, item.Year, item.Image, DATE_FORMAT(item.Date_scan , "%Y-%m-%d") AS product_editdate, item.Email_Committee AS name_editor, item.Location ,item.Room ,item.Cost_center ,item.Department , item.Status FROM item WHERE item.Inventory_Number = ? AND item.Year = ?'
        con.query(sql, [product_code, result1[0].Year], function (err, result) {
            if (err) {
                res.status(404).end();
            }
            if (result.length > 0) {
                res.json(result);
            } else {
                res.send('ไม่พบข้อมูล').end();
            }
        });

    });
});

router.get('/check_date/:code', function (req, res) {
    let product_code = req.params.code;
    let currectDate = moment().add(543, 'years').format('YYYY-MM-DD');
    let sql = 'SELECT DATE_FORMAT(Date_start , "%Y-%m-%d") AS start_date , DATE_FORMAT(Date_end , "%Y-%m-%d") AS stop_date , item.Status FROM date_check , item WHERE date_check.Years = (year(CURDATE()))+543 AND item.Inventory_Number = ? AND item.Year = (year(CURDATE()))+543'
    con.query(sql, product_code, function (err, result) {
        if (err) {
            res.status(404).end();
        } else {
            if (result.length == 0) {
                res.send('3').end(); // don't have product id  
                // console.log('3')
            }

            if (result.length > 0) {

                if (currectDate >= result[0].start_date && currectDate <= result[0].stop_date && result[0].Status == 0) {
                    res.send('1').end(); // 1 is can edit  
                    // console.log("Can Edit")                  
                } else {
                    res.send('2').end(); // 2 is can see only bacause current date more than end_date in database   
                    // console.log("See only")                 
                }
            }
        }
    });
});

router.get('/home_chart', function (req, res) {
    let sql = 'SELECT date_check.*,(SELECT COUNT(*) FROM item WHERE Status = 0 AND Year = (year(CURDATE()))+543)AS defaultStatus ,(SELECT COUNT(*) FROM item WHERE Status = 1 AND Year = (year(CURDATE()))+543)AS product_normal ,(SELECT COUNT(*) FROM item WHERE Status = 2 AND Year = year(CURDATE())+543)AS product_repair FROM item,date_check WHERE date_check.Years = (year(CURDATE()))+543 GROUP BY status';
    con.query(sql, function (err, result) {
        if (err) {
            res.status(404).end();
        } else {
            res.json(result);
        }
    });
});

var uploadpic = multer({ storage: storageOptionpic }).single("photo");
router.post('/uploadWithImage', function (req, res, next) {
    uploadpic(req, res, err => {
        if (err) {
            console.log("upload " + err);
            res.status(500);
        } else {
            let data = JSON.parse(req.body.data)
            let path_image = req.file.originalname;
            // console.log(path_image)
            let product_editDate = data.product_editorDate;
            let user_editor = data.user_editor;
            let product_statusID = data.product_statusID;
            let product_code = data.product_code;
            let sql = 'UPDATE item SET item.Image = ? , item.Date_scan = ? , item.Email_Committee = ?, item.Status = ? WHERE item.Inventory_Number = ? AND item.Year = (YEAR(CURDATE()))+543';
            con.query(sql, [path_image, product_editDate, user_editor, product_statusID, product_code], function (err, result) {
                if (err) {
                    console.log("sql " + err);
                    res.status(404).end();
                }
                else {
                    res.status(200).end();
                }
            })
        }
    })
});


router.post('/uploadNoImage', function (req, res) {
    let product_editDate = req.body.product_data.product_editorDate;
    let user_editor = req.body.product_data.user_editor;
    let product_statusID = req.body.product_data.product_statusID;
    let product_code = req.body.product_data.product_code;
    let sql = 'UPDATE item SET item.Date_scan = ? , item.Email_Committee = ?, item.Status = ? WHERE  item.Inventory_Number = ? AND item.Year = (YEAR(CURDATE()))+543';
    con.query(sql, [product_editDate, user_editor, product_statusID, product_code], function (err, result) {
        if (err) {
            res.status(404).end();
        } else {
            res.status(200).end();
        }
    })

})

router.put('/keepusername', function (req, res) {
    const currentYear = new Date().getFullYear() + 543;
    const { email, name } = req.body;
    let sql = 'UPDATE year_user SET Name = ? where Email_user = ? AND Year = ?';
    con.query(sql, [name,email, currentYear], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result.length == 0) {
            res.status(403).end();
        }
        else {
            res.send(result).end();

        }
    });
});

module.exports = router;