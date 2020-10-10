require('dotenv').config();

//<=========== Import packages ==========>
const compression = require("compression");
const express = require("express");
const path = require("path");
const body_parser = require("body-parser");
const multer = require("multer");
const mysql = require("mysql");
// const helmet = require("helmet");        //FIXME: Cross-site scripting is used, cannot use helmet, fix later!
const config = require("./config/dbConfig.js");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
require("./config/passport-setup");
const passport = require("passport");
const cookieSession = require("cookie-session");
const key = require("./config/key");
// const xlsx = require("xlsx");

const readXlsxfile = require("read-excel-file/node")
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
const moment = require('moment');
// const e = require("express");
const app = express();
const con = mysql.createConnection(config);
const d = new Date().getFullYear() + 543;
app.use('/Image', express.static('./upload/Image'));


//=========Put to use==========
const storageOption = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/Exel/')
    },
    filename: function (req, file, cb) {

        cb(null, d + "_" + file.originalname);

    }
});

// Upload image
const storageOptionpic = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/Image')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var uploadpic = multer({ storage: storageOptionpic }).single("photo");
const upload = multer({ storage: storageOption }).single("filetoupload");


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
// authen
app.use("/auth", authRoutes);
// profle
app.use("/profile", profileRoutes);

// app.set("view engine", "ejs");

app.use("/img", express.static(path.join(__dirname, 'img')));
app.use("/img1", express.static(path.join(__dirname, '../mobile/assets/img')));
app.use("/style.css", express.static(path.join(__dirname, 'style.css')));
app.use("/upload", express.static(path.join(__dirname, 'upload')));
app.use("/assets", express.static(path.join(__dirname, 'assets')));
app.use("/JS_Files", express.static(path.join(__dirname, 'JS_Files')));


// =========== Services ===========
app.post('/api/uploadWithImage', function (req, res, next) {
    uploadpic(req, res, err => {
        if (err) {
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
                    res.status(404).end();
                }
                else {
                    res.status(200).end();
                }
            })
        }
    })
})

// =========== Services (Page loading) ===========
//Root Page (landing page 1)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
    // res.render("home.ejs", {user: req.user});
});

//Return manageUser page
app.get("/checkpage", function (req, res) {
    res.sendFile(path.join(__dirname, "/checkpage.html"))
});
app.get("/manageUser", function (req, res) {
    res.sendFile(path.join(__dirname, "/manageUser.html"))
});

app.get("/printqrcode", function (req, res) {
    res.sendFile(path.join(__dirname, "/printqrcode.html"))
});

app.get("/printbarcode", function (req, res) {
    res.sendFile(path.join(__dirname, "/printbarcode.html"))
});

//Return home page
app.get("/mainpage", function (req, res) {
    res.sendFile(path.join(__dirname, "/mainpage.html"))
});

//Return User_history page
app.get("/User_history", function (req, res) {
    res.sendFile(path.join(__dirname, "/User_history.html"))
});

//Return Aseet page
app.get("/asset", function (req, res) {
    res.sendFile(path.join(__dirname, "/asset.html"))
});

//Return Aseet page
app.get("/announce", function (req, res) {
    res.sendFile(path.join(__dirname, "/newspage.html"))
});

//Return dashboard page
app.get("/dashboard", function (req, res) {
    res.sendFile(path.join(__dirname, "/dashboard.html"))
});

//Return change_disapear page
app.get("/change_disapear", function (req, res) {
    res.sendFile(path.join(__dirname, "/change_disapear.html"))
});

//Return Date_manage time page
app.get("/Date_manage", function (req, res) {
    res.sendFile(path.join(__dirname, "/Date_manage.html"))
});

//Return Date_managerUser page
app.get("/Date_manageUser", function (req, res) {
    res.sendFile(path.join(__dirname, "/Date_manageUser.html"))
});

//Return single item page
app.get("/singleItem", function (req, res) {
    res.sendFile(path.join(__dirname, "/singleItem.html"))
});

//Return information page
app.get("/information", function (req, res) {
    res.sendFile(path.join(__dirname, "/information.html"))
});


//Return landing1 page
app.get("/takepicture", function (req, res) {
    res.sendFile(path.join(__dirname, "/takepicture.html"))
});

//Return adminhistory page
app.get("/adminhistory", function (req, res) {
    res.sendFile(path.join(__dirname, "/Admin_history.html"))
});


//================== Services (functions) ===================
// ============= Upload ==============
app.post("/uploading/:email", function (req, res) {
    const email = req.params.email
    upload(req, res, function (err) {
        if (err) {
            // An unknown error occurred when uploading.
            res.status(500).send("ไม่สามารถอัพโหลดไฟล์นี้ได้");
            return;
        }
        // Everything went fine.
        // console.log(email)
        importExelData2MySQL(res, __dirname + '/upload/Exel/' + req.file.filename, email)
        // console.log(req.file.filename)
        // res.status(200).send("บันทึกสำเร็จ");
    })
});
// import 
function importExelData2MySQL(res, filePath, email) {
    readXlsxfile(filePath).then((rows) => {
        let head = rows[0]
        const date = new Date();
        rows.shift();

        let sql = "INSERT INTO item (`Asset_Number`,Inventory_Number,`Asset_Description`,`Model`,`Serial`,`Location`,`Room`,`Received_date`,`Original_value`,`Cost_center`,`Department`,`Vendor_name`,Year,Status, Email_Importer,Date_Upload) VALUES ?";
        let sql2 = "DELETE from item WHERE Year=?"
        var count = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        let result = []
        for (var i = 0; i < rows.length; i++) {
            var temp = rows[i];
            rows[i] = [];

            for (var j = 0; j < 12; j++) {
                rows[i].push(temp[count[j]]);
                if (j == 1) {
                    result.push(temp[count[j]]);
                }
            }
            rows[i].push(d);
            rows[i].push(0);
            rows[i].push(email);
            rows[i].push(date);
        }
        let sortre = result.sort();
        let count_dup = 0
        let duplicate = '';
        for (let i = 0; i < sortre.length - 1; i++) {
            if (sortre[i + 1] == sortre[i]) {
                count_dup++;
                duplicate = sortre[i];
            }
        }

        var checkhead = ["Asset", "Inventory number", "Asset description", "ยี่ห้อ/รุ่น", "Serial number", "Location", "Room", "วันที่รับทรัพย์สิน", "Original value", "Cost Center", "หน่วยงาน", "Vendor Name1"];
        let count_head = 0
        
        for (let i = 0; i < count.length; i++) {
            if (head[count[i]] != checkhead[i]) {
                // console.log(head[count[i]] + "  " + checkhead[i] + "  " + i)
                count_head++;
            }
        }
        // console.log(count_dup)

        if (count_dup == 0 && count_head == 0) {
            con.query(sql2, [d], function (err, result, fields) {
                if (err) {
                    console.log(err);
                }
                else {
                    // res.send("delete")
                    con.query(sql, [rows], function (err, result, fields) {
                        if (err) {
                            // console.log('มีข้อมูลนี้แล้วในระบบ');
                            res.send("มีข้อมูลนี้แล้วในระบบ")
                        }
                        else {
                            res.send("1")//บันทึกสำเสร็จ

                        }
                    })

                }
            })

        }
        else {
            res.send(duplicate)//ข้อมูลซ้ำหรือไม่ครบ
        }
    });
}

// ============= Upload if already upload ==============
app.post("/uploadif/:email", function (req, res) {
    const email = req.params.email
    upload(req, res, function (err) {
        if (err) {
            // An unknown error occurred when uploading.
            res.status(500).send("ไม่สามารถอัพโหลดไฟล์นี้ได้");
            return;
        }
        // Everything went fine.
        importfromexel(res, __dirname + '/upload/' + req.file.filename, email)

    })
});
// import
function importfromexel(res, filePath, email) {
    readXlsxfile(filePath).then((rows) => {

        const date = new Date();
        rows.shift();
        const Year = new Date().getFullYear();
        const sql = "DELETE FROM item WHERE Year = ? ;"
        con.query(sql, [d], function (err, result, fields) {
            if (err) {
                res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
                console.log(err)
            }
            else {

            }
        })
        let sql2 = "INSERT INTO item (`Asset_Number`,Inventory_Number,`Asset_Description`,`Model`,`Serial`,`Location`,`Room`,`Received_date`,`Original_value`,`Cost_center`,`Department`,`Vendor_name`,Year,Status, Email_Importer,Date_Upload) VALUES ?";
        var count = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        for (var i = 0; i < rows.length; i++) {
            var temp = rows[i];
            rows[i] = [];
            for (var j = 0; j < 12; j++) {
                rows[i].push(temp[count[j]]);
            }
            rows[i].push(d);
            rows[i].push(0);
            rows[i].push(email);
            rows[i].push(date);
        }


        con.query(sql2, [rows], function (err, result, fields) {
            if (err) {
                res.send("มีข้อมูลนี้แล้วในระบบ")
            } else {

            }
        })

    });
}


// บังคับถ่ายรูป
app.put("/item/take/:year", function (req, res) {
    const year = req.params.year;
    const Status = req.body.Status;
    const records = req.body.records;
    // console.log(Status)

    if (Status == 1) {
        const sql = "UPDATE item SET Takepicture = 1 where Inventory_Number IN(?) ;"
        con.query(sql, [records, year], function (err, result, fields) {
            if (err) {
                res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
                console.log(err)
            }
            else {
                res.send("แก้ไขข้อมูลเรียบร้อย");
                // console.log("successtake")
            }
        })
    }
    else {
        const sql = "UPDATE item SET Takepicture = 0 where Inventory_Number IN(?) ;"
        con.query(sql, [records, year], function (err, result, fields) {
            if (err) {
                res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
                console.log(err)
            }
            else {
                res.send("แก้ไขข้อมูลเรียบร้อย");
                // console.log("successtake")
            }
        })
    }




});


// Add image to an item
app.put("/item/addImage", function (req, res) {
    const image = req.body.image;
    const Inventory_Number = req.body.Inventory_Number;
    const sql = "UPDATE item SET Image=? where Inventory_Number=?;"
    con.query(sql, [image, Inventory_Number], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        }
        else {
            res.send("แก้ไขข้อมูลเรียบร้อย");
        }
    })
});

// Load info of all user 
app.get("/manageUser/showAllUsers/:Email_user", function (req, res) {
    const Email_user = req.params.Email_user;
    // const Year =  new Date().getFullYear();
    const sql = "select Year,Email_user,Email_assigner,Role from Year_user WHERE Email_user = ? ORDER BY Year DESC"

    con.query(sql, [Email_user], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            if (result.length === 0) {
                res.json(0)
            } else if (result[0].Role === '3') {
                res.json(result)
            } else if (result[0].Year === d) {
                res.json(result)
            } else {
                res.json(0)
            }

        }
    })
});


// // Load info of commitee
app.get("/adminhistorytableEmailCommittee/info/:year", function (req, res) {
    const Year = req.params.year;
    const sql = "SELECT DISTINCT Email_Committee FROM item WHERE Year = ? AND Email_Committee IS NOT NULL "
    con.query(sql, [Year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)

        }
    })
});

// // Load info of commitee
app.get("/adminhistorytableEmailCommittee/infoshow", function (req, res) {
    const sql = "SELECT DISTINCT Email_Committee FROM item WHERE Email_Committee IS NOT NULL ORDER BY Year DESC "
    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)

        }
    })
});

// // Load info of Year that scaned
app.get("/adminhistorytableEmailCommittee/year", function (req, res) {
    const sql = "SELECT DISTINCT Year FROM item WHERE Email_Committee IS NOT NULL ORDER BY Year"
    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            // console.log(result.length)
            if (result.length == 0) {
                result = [{ Year: d }]
                // console.log(result[0].year=(d))
                // result=
                // result[0].Year=(d)
                // console.log(result[0].Year)
                // console.log('aa')
                res.json(result)
            } else {
                res.json(result)
            }
        }
    })
});

//Load info of adminhistory page
app.get("/adminhistorytable/info/:EmailCommittee/:year", function (req, res) {
    const Email_Committee = req.params.EmailCommittee;
    const year = req.params.year;
    const sql = "SELECT COUNT(Inventory_Number) AS num FROM item WHERE Email_Committee = ? and Year = ?"

    con.query(sql, [Email_Committee, year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {

            if (result[0].num == 0) {
            } else {
                res.json(result)
            }
        }
    })
});


// // Load info of name commitee
app.get("/EmailCommitteename/info/:Email_name", function (req, res) {
    const Email_user = req.params.Email_name;
    const sql = "SELECT Name FROM year_user WHERE Email_user = ?"
    con.query(sql, [Email_user], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)

        }
    })
});


// Load inspected total item numbers by a user
app.get("/user/profile/inspectedItem/Total/Number1/:Email_Committee", function (req, res) {
    const Email_Committee = req.params.Email_Committee;
    const sql = "SELECT count(Status) AS 'Numbers_of_Inspected_Item' FROM item WHERE Email_Committee=? AND Year =?;"

    con.query(sql, [Email_Committee, d], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Loadnumber people scan in that day
app.get("/user/datescan", function (req, res) {
    const Year = new Date().getFullYear();
    const sql = "SELECT Date_Scan FROM item WHERE Year = ? AND Date_Scan IS NOT NULL ;"

    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load inspected total item numbers by a user
app.get("/user/profile/inspectedItem/Total/Number/:Email_Committee", function (req, res) {
    const Email_Committee = req.params.Email_Committee;
    const sql = "SELECT count(Status) AS 'Numbers_of_Inspected_Item' FROM item WHERE Email_Committee=?;"

    con.query(sql, [Email_Committee], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load inspected item numbers of status by user
app.get("/user/profile/inspectedItem/:Status/:Email_Committee", function (req, res) {
    const Email_Committee = req.params.Email_Committee;
    const Status = req.params.Status;
    const sql = "SELECT count(Status) AS 'Numbers_of_Inspected_Item' FROM item WHERE Status=? AND Email_Committee=?;"

    con.query(sql, [Status, Email_Committee], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});
// Load Year
app.get("/Year/user", function (req, res) {
    const sql = "SELECT DISTINCT Year FROM Year_user ORDER BY Year DESC"


    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load date scan
app.get("/datescan/user", function (req, res) {
    const Year = new Date().getFullYear();
    const sql = "SELECT DISTINCT Date_Scan FROM item where Year = ? AND Date_scan IS NOT NULL ORDER BY Date_scan "
    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load Year
app.get("/Year/iteem", function (req, res) {
    const sql = "SELECT DISTINCT Year FROM item ORDER BY Year "


    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});


// Load Year



// Add info of new user in manage user page
app.put("/manageUser/update/:Email_user/:Email_assigner/:Role/:Email_useru", function (req, res) {

    const Email_user = req.params.Email_user;
    const Email_assigner = req.params.Email_assigner;
    const Role = req.params.Role;
    const Email_useru = req.params.Email_useru;

    const sql = "UPDATE year_user SET Email_user = ?,Email_assigner = ?,Role = ? WHERE Email_user = ? and Year = ?;";
    con.query(sql, [Email_user, Email_assigner, Role, Email_useru, d], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
            console.log(err)
        }
        else {
            res.send("แก้ไขข้อมูลเรียบร้อย");
        }
    })
});

// add name to database
app.put("/manageUser/updatename/:Name/:Email_user", function (req, res) {
    const Name = req.params.Name;
    const Email_user = req.params.Email_user;

    const sql = "UPDATE Year_user SET Name = ? WHERE Email_user = ?;";
    con.query(sql, [Name, Email_user], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        }
        else {
            res.send("แก้ไขข้อมูลเรียบร้อย");
        }
    })
});

// Load email of user
app.get("/user/index/info/emailUser/:Email_user", function (req, res) {
    const Email_user = req.params.Email_user;
    const sql = "SELECT Email_user FROM `Year_user` WHERE Email_user=?;"

    con.query(sql, [Email_user], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load inspected item by the user
app.get("/user/profile/inspectedInfoItem/:Email_Committee", function (req, res) {
    const Email_Committee = req.params.Email_Committee;
    const sql = "select Image,Inventory_Number,Received_date,Date_scan,Model,Date_Scan,Department,Date_Upload,Status,Email_Committee from item where Email_Committee=?;"

    con.query(sql, [Email_Committee], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load all item info
app.get("/item/dashboard/showAllInfo", function (req, res) {
    const sql = "select * from item"

    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load all item for import
app.get("/item/dashboard/showuser", function (req, res) {


    const sql = "select DISTINCT Status from item WHERE Year = ?;"

    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load all item info with location

app.get("/item/dashboard/showAllInfo/:location/:email/:year", function (req, res) {
    const location = req.params.location;
    const email = req.params.email;
    const year = req.params.year;
    const sql = "select * FROM item WHERE Location = ? AND Email_Committee = ? AND Year = ?"

    con.query(sql, [location, email, year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)

        }
    })
});

// Load all item info with location

app.get("/item/dashboard/showAllInfoall/:location/:year", function (req, res) {
    const location = req.params.location;
    const year = req.params.year;
    const sql = "select * FROM item WHERE Location = ? AND Year = ?"

    con.query(sql, [location, year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)

        }
    })
});

// Load all item info with location

app.get("/item/dashboard/showAllInfoall/:location/:year", function (req, res) {
    const location = req.params.location;
    const year = req.params.year;
    const sql = "select * FROM item WHERE Location = ? AND Year = ?"

    con.query(sql, [location, year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)

        }
    })
});

// Load all item info with location with normal status
app.get("/item/dashboard/showAllInfonormal/:location/:Year", function (req, res) {
    const location = req.params.location;
    const Year= req.params.Year
    const sql = "select * FROM item WHERE Location = ? AND Status = 1 AND Year = ?"

    con.query(sql, [location, Year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load item numbers
app.get("/item/dashboard/number/:status", function (req, res) {
    const sql = "SELECT count(Status) AS 'Numbers_of_item' FROM item WHERE Status=?;"
    const Year = new Date().getFullYear();
    const status = req.params.status;
    con.query(sql, [status, Year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load all item info with location

app.get("/item/dashboard/showAllInfo/:Room/:year", function (req, res) {
    const Room = req.params.Room;
    const year = req.params.year;
    const sql = "select * FROM item WHERE Room = ? AND Year = ?"

    con.query(sql, [Room, year], function (err, result, fields) {
        if (err) {
            console.log(err)
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)

        }
    })
});

// Load item numbers
app.get("/item/dashboard/number", function (req, res) {
    const sql = "SELECT count(Status) AS 'Numbers_of_item' FROM item ;"
    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load item numbers 
app.get("/item/dashboard/number2/:status/:Year", function (req, res) {
    const sql = "SELECT count(Status) AS 'Numbers_of_item' FROM item WHERE Status=? AND Year = ?;"
    const Year = req.params.Year;
    const email = req.params.email;
    const status = req.params.status;
    con.query(sql, [status, Year, email], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load item numbers with Year
app.get("/item/dashboard/number2user/:status/:Year/:email", function (req, res) {
    const sql = "SELECT count(Status) AS 'Numbers_of_item' FROM item WHERE Status=? AND Year = ? AND Email_Committee = ?;"
    const Year = req.params.Year;
    const email = req.params.email;
    const status = req.params.status;
    con.query(sql, [status, Year, email], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load item numbers Year
app.get("/item/dashboard/number1/:Year", function (req, res) {
    const sql = "SELECT count(Status) AS 'Numbers_of_item' FROM item WHERE Year = ?;"
    const Year = req.params.Year;
    con.query(sql, [Year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});


// Load item numbers Year
app.get("/item/dashboard/number1all/:Year/:email", function (req, res) {
    const sql = "SELECT count(Status) AS 'Numbers_of_item' FROM item WHERE Year = ? AND Email_Committee = ?;"
    const Year = req.params.Year;
    const email = req.params.email;
    con.query(sql, [Year, email], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});


// // Load location
app.get("/item/Location/:year", function (req, res) {
    const year = req.params.year
    const sql = "SELECT DISTINCT Location FROM item where Year = ?"


    con.query(sql, [year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// // Load Room
app.get("/item/Room/:year", function (req, res) {
    const year = req.params.year
    const sql = "SELECT DISTINCT Room FROM item where Year = ?"

    con.query(sql, [year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// // Load location
app.get("/item/location/:email/:year", function (req, res) {
    const email = req.params.email;
    const year = req.params.year;
    const sql = "SELECT DISTINCT Location FROM item WHERE Email_Committee = ? AND Year = ?;"


    con.query(sql, [email, year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// // Load location
app.get("/item/Locationnormal", function (req, res) {
    const sql = "SELECT DISTINCT Location FROM item WHERE Status = 1 AND Year = ?"
    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            if (result.length === 0) {
                con.query(sql, [d - 1], function (err, result, fields) {
                    if (err) {
                        res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
                    } else {
                        res.json(result)
                    }
                })
            } else {
                res.json(result)
            }

        }
    })
});

// // Load Status
app.get("/item/Status/:year", function (req, res) {
    const year = req.params.year
    const sql = "SELECT DISTINCT Status FROM item where year=?"


    con.query(sql, [year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// // Load Status
app.get("/item/Status/:email/:year", function (req, res) {
    const email = req.params.email;
    const year = req.params.year;
    const sql = "SELECT DISTINCT Status FROM item WHERE Email_Committee = ? AND Year =?"

    con.query(sql, [email, year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load all item info with Status



app.get("/item/dashboard/showAllInfo1/:status/:email/:year", function (req, res) {
    const status = req.params.status;
    const email = req.params.email;
    const year = req.params.year;
    const sql = "select * from item WHERE Status = ? AND Email_Committee = ? AND Year =?"

    con.query(sql, [status, email, year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)

        }
    })
});


// Load all item info with Status no email

app.get("/item/dashboard/showAllInfostatus/:status/:year", function (req, res) {
    const status = req.params.status;
    const year = req.params.year;
    const sql = "select * from item WHERE Status = ? AND Year =?"

    con.query(sql, [status, year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
            // console.log(status)
        }
    })
});


// // Load Year
app.get("/item/Year", function (req, res) {
    const sql = "SELECT DISTINCT Year FROM item ORDER BY Year DESC"


    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});


// // Load Year
app.get("/item/Yearuser/:email", function (req, res) {
    const email = req.params.email;
    const sql = "SELECT DISTINCT Year FROM item WHERE Email_Committee=? ORDER BY Year DESC"

    con.query(sql, [email], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});


// Load all item info with Year
app.get("/item/dashboard/showAllInfo4/:Year", function (req, res) {
    const Year = req.params.Year;
    const sql = "select * from item WHERE Year = ?"

    con.query(sql, [Year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});


// Load all item info with Year email
app.get("/item/showAllInfoall/:Year/:email", function (req, res) {
    // /item/dashboard/number1all/
    const Year = req.params.Year;
    const email = req.params.email;
    // console.log(email + Year)

    const sql = "select * from item WHERE Year =? AND Email_Committee = ?"

    con.query(sql, [Year, email,], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");

        } else {
            res.json(result)
            // console.log("Success")

        }
    })
});


// // Load commitee
app.get("/item/Email_Committee/:year", function (req, res) {
    const year = req.params.year;
    const sql = "SELECT DISTINCT Email_Committee FROM item where Email_Committee is NOT NULL and Year = ? ORDER BY Email_Committee"

    con.query(sql, [year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load all item info with commitee
app.get("/item/dashboard/showAllInfo3/:Email_Committee/:Year", function (req, res) {
    const thecommittee = req.params.Email_Committee;
    const committee_year = req.params.Year;
    const sql = "select * from item WHERE Email_Committee  = ? and Year = ?"

    con.query(sql, [thecommittee, committee_year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});


// Load item info
app.get("/item/:status", function (req, res) {
    const sql = "select Image,Inventory_Number,Model,Serial,Location,Received_date,Original_value,Department,Vendor_name,Date_Upload,Date_scan,Email_Committee,Status from item where Status=? AND Year =?"
    const Year = new Date().getFullYear();
    const status = req.params.status;
    con.query(sql, [status, Year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});
// UPDATE item,Year_user SET item.Status=? where item.Inventory_Number=? AND Year_user.Email_user=?
// For print barcode or QR code of item
app.get("/item/forPrintQRcode_Barcode/:Email_Committee", function (req, res) {
    const sql = "select Inventory_Number, Asset_Description, Received_date, Department, Year,Status, Image from item where Year=? and Email_Committee=?;"
    const Year = new Date().getFullYear();
    const Email_Committee = req.params.Email_Committee;
    con.query(sql, [d, Email_Committee], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load some info of item of landing1
app.get("/landing1/showSomeInfo", function (req, res) {
    const sql = "select Inventory_Number,Asset_description,Received_date,Department,Image from item"

    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load all info of item of landing1
app.get("/landing1/showAllInfo", function (req, res) {
    const sql = "select Inventory_Number,Status,Model,Location,Original_value,Email_Committee,Cost_center,Serial,Date_Upload,Asset_description,Received_date,Department,Image from item"

    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load some info of item of landing2
app.get("/landing2/showSomeInfo", function (req, res) {
    const sql = "select Inventory_Number,Status,Model,Cost_center,Received_date,Department,Image from item"

    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load item number all in database
app.get("/item/numberAll", function (req, res) {
    const Year = new Date().getFullYear();
    const sql = "SELECT count(Status) AS 'Numbers_of_Inspected_Item' FROM item WHERE Year = ?"
    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.send(result)
        }
    })
});

// Load date and time of job
app.get("/dateTime/showDateTime", function (req, res) {
    const sql = "select * from date_check where Years = ?"

    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            if (result.length > 0) {
                res.json(result)
            } else {
                res.json(0)
            }

        }
    })
});

// Load info of main datatable page
app.get("/maindataTable/info/:status/:Year", function (req, res) {
    const sql = "select Image,Asset_Description,Inventory_Number,Model,Serial,Location,Received_date,Original_value,Cost_center,Room,Department,Vendor_name,Date_Upload,Date_scan,Email_Committee,Status,Date_Scan from item where Status=? and  Year=?"
    const Year = req.params.Year;
    const status = req.params.status;
    con.query(sql, [status, Year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Edit status of item
app.put("/item/edit", function (req, res) {
    const Status = req.body.Status;
    const Inventory_Number = req.body.Inventory_Number;
    const Email_user = req.body.Email_user;
    const sql = "UPDATE item,Year_user SET item.Status=? where item.Inventory_Number=? AND Year_user.Email_user=?;"
    con.query(sql, [Status, Inventory_Number, Email_user], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        }
        else {
            res.send("แก้ไขข้อมูลเรียบร้อย");
        }
    })
});

// delete user 
app.delete("/manageUser/deleteAllUser/:Email", function (req, res) {
    const Email = req.params.Email;

    const sql = "DELETE from Year_user WHERE Email_user = ? AND Year=?"
    con.query(sql, [Email, d], function (err, result, fields) {
        if (err) {
            console.log(err)
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// delete item
app.delete("/manageItem/deleteAllitem", function (req, res) {

    const Year = new Date().getFullYear();
    const sql2 = "DELETE from item WHERE Year=?"
    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load info of all user of manage user page
app.get("/manageUser/showAllUser/:Year", function (req, res) {
    const Year = req.params.Year;
    const sql = "select Year,Email_user,Email_assigner,Role,Name from Year_user WHERE Year=? "

    con.query(sql, [Year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load mane
app.get("/manageUser/showAlladminname", function (req, res) {
    Email_assigner = req.params.Email_assigner;
    const sql = "select * from Year_user WHERE Role = 1"

    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)

        }
    })
});

// Add info of new user in manage user page
app.post("/manageUser/add/:Email_user/:Email_assigner/:Role", function (req, res) {
    const Year = new Date().getFullYear();
    const Email_user = req.params.Email_user;
    const Email_assigner = req.params.Email_assigner;
    const Role = req.params.Role;

    const sql = "INSERT INTO Year_user(Year,Email_user,Email_assigner,Role) VALUES (?,?,?,?)";
    con.query(sql, [d, Email_user, Email_assigner, Role], function (err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
            return;
        }
        // get inserted rows
        const numrows = result.affectedRows;
        if (numrows != 1) {
            console.error("Error");
            res.status(500).send("ไม่สามารถเพิ่มข้อมูลได้");
        }
        else {
            res.send("เพิ่มข้อมูลเรียบร้อย");
        }

    });
});

// Load item info landing 2
app.get("/con/:Inventory_Number/:Year", function (req, res) {
    const sql = "SELECT Image,Inventory_Number,Model,Serial,Location,Received_date,Asset_Description,Room,Original_value,Cost_center,Department,Vendor_name,Date_Upload,Date_scan,Email_Committee,Status,Date_Scan FROM `item` WHERE `Inventory_Number` =? AND Year =?"
    const Year = req.params.Year;
    const Inventory_Number = req.params.Inventory_Number;
    con.query(sql, [Inventory_Number, Year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load item info landing 2
app.get("/item5/:Inventory_Number/:Year", function (req, res) {
    const sql = "SELECT Image,Inventory_Number,Model,Serial,Location,Received_date,Asset_Description,Room,Original_value,Cost_center,Department,Vendor_name,Date_Upload,Date_scan,Email_Committee,Status,Date_Scan FROM `item` WHERE `Inventory_Number` =? AND Year =?"
    const Year = req.params.Year;
    const Inventory_Number = req.params.Inventory_Number;
    con.query(sql, [Inventory_Number, Year], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

app.get("/numberitem", function (req, res) {
    const Year = new Date().getFullYear();
    const sql = "SELECT count(Inventory_Number) AS numofitem FROM item WHERE Year = ?"
    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.send(result)

        }
    })
});

// Insert Work Time
app.post("/dateTime/insertTime/:Date_start/:Date_end", function (req, res) {
    // ฟิค Years ไว้ใน database ทำให้ไม่สามารถใส่ปีซ้ำได้
    const Date_start = req.params.Date_start;
    const Date_end = req.params.Date_end;

    const sql = "INSERT INTO date_check(Years,Date_start,Date_end) VALUES (?,?,?)";
    con.query(sql, [d, Date_start, Date_end], function (err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(503).send("ไม่สามารถเพิ่มข้อมูลได้ เนื่องจากมีข้อมูลของปีนี้อยู่ในระบบแล้ว");
            return;
        }
        // get inserted rows
        const numrows = result.affectedRows;
        if (numrows != 1) {
            console.error("Error");
            res.status(500).send("ไม่สามารถเพิ่มข้อมูลได้");
        }
        else {
            res.send("เพิ่มข้อมูลเรียบร้อย");
        }

    });

});

// Update date
app.put("/dateTime/updateTime/:Date_start/:Date_end", function (req, res) {

    const Date_start = req.params.Date_start;
    const Date_end = req.params.Date_end;
    const sql = "UPDATE date_check SET Date_start=?, Date_end=? where Years=?;"
    con.query(sql, [Date_start, Date_end, d], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        }
        else {
            res.send("แก้ไขข้อมูลเรียบร้อย");
        }
    })
});

// Load announement
app.get("/Loadannounce", function (req, res) {
    // const Year = new Date().getFullYear();
    const sql = "SELECT * FROM `announcement` ORDER BY `Number`  DESC"
    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.send(result)

        }
    })
});

// upload photo announce
app.post("/UploadingPhoto", function (req, res) {

    upload(req, res, function (err) {
        if (err) {
            // An unknown error occurred when uploading.
            res.status(500).send("ไม่สามารถอัพโหลดไฟล์นี้ได้");
            return;
        }
        else {
            file_name = req.file.filename
            // console.log(file_name)
            res.json(file_name)
        }

    })
});

//upload annonce
app.post("/AddAnnounce/:EmailOwner", function (req, res) {
    const EmailOwner = req.params.EmailOwner
    const { Head, Detail, DateEndCreate, Status } = req.body
    const sql = "INSERT INTO `announcement` ( `Head`, `Detail`,`DateEndCreate` ,`Status`, `Email_announcer`) VALUES (?, ?, ?, ?,?);"
    con.query(sql, [Head, Detail, DateEndCreate, Status, EmailOwner], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง")
            console.log(err)
        }
        else {
            res.send("/announce");
        }
    })
});

//update announce
app.put("/EditAnnounce/:EmailOwner/:Number1", function (req, res) {
    const EmailOwner = req.params.EmailOwner
    const Number1 = req.params.Number1
    const { Head, Detail, DateEndCreate, Status } = req.body
    const sql = "UPDATE `announcement` SET `Head` = ?, `Detail` = ?, `DateEndCreate` = ?,`Status` = ?, `Email_announcer` = ? WHERE `announcement`.`Number` = ?;"
    con.query(sql, [Head, Detail, DateEndCreate, Status, EmailOwner, Number1], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง")
            console.log(err)
        }
        else {
            res.send("/announce");

        }
    })
});

//delete announce
app.delete("/DeleteAnnounce/:Number1", function (req, res) {
    // const EmailOwner = req.params.EmailOwner
    const Number1 = req.params.Number1

    const sql = "DELETE FROM `announcement` WHERE `announcement`.`Number` = ?"
    con.query(sql, [Number1], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง")
            console.log(err)
        }
        else {
            if (result.affectedRows != 1) {
                res.status(503).send("Delete Failed")
            }
            else {
                res.send("/announce");
                // console.log("Delete Successed")
            }

        }
    })
});


app.post('/api/uploadNoImage', function (req, res) {
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

app.put('/api/keepusername', function (req, res) {
    let { email } = req.body;
    let { name } = req.body;
    let sql = 'UPDATE year_user SET Name = ? where Email_user = ? AND Year = ?';
    con.query(sql, [name,email,d], function (err, result) {
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

app.post('/api/login', function (req, res) {
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

app.get('/api/get_product/:id', function (req, res) {

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


app.get('/api/get_productfromotheryear/:id', function (req, res) {

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

app.get('/api/check_date/:code', function (req, res) {
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

app.get('/api/home_chart', function (req, res) {
    let sql = 'SELECT date_check.*,(SELECT COUNT(*) FROM item WHERE Status = 0 AND Year = (year(CURDATE()))+543)AS defaultStatus ,(SELECT COUNT(*) FROM item WHERE Status = 1 AND Year = (year(CURDATE()))+543)AS product_normal ,(SELECT COUNT(*) FROM item WHERE Status = 2 AND Year = year(CURDATE())+543)AS product_repair FROM item,date_check WHERE date_check.Years = (year(CURDATE()))+543 GROUP BY status';
    con.query(sql, function (err, result) {
        if (err) {
            res.status(404).end();
        } else {
            res.json(result);
        }
    });

});

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