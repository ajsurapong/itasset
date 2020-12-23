const router = require("express").Router();
const path = require('path');
const multer = require("multer");
const mysql = require("mysql");
const readXlsxfile = require("read-excel-file/node")
const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const config = require("../config/dbConfig.js");
const con = mysql.createConnection(config);

const d = new Date().getFullYear() + 543;

//=========Put to use==========
const storageOption = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/Exel/')
    },
    filename: function (req, file, cb) {

        cb(null, d + "_" + file.originalname);

    }
});

const upload = multer({ storage: storageOption }).single("filetoupload");

// =========== Services ===========

//================== Services (functions) ===================
// ============= Upload ==============
router.post("/uploading/:email", function (req, res) {
    const email = req.params.email;
    upload(req, res, function (err) {
        if (err) {
            // An unknown error occurred when uploading.
            console.log(err);
            res.status(500).send("ไม่สามารถอัพโหลดไฟล์นี้ได้");
            return;
        }
        // Everything went fine.
        // console.log(email)
        // importExelData2MySQL(res, process.cwd() + '/upload/Exel/' + req.file.filename, email);
        importExelData2MySQL(res, path.join(__dirname, '../upload/Exel/' , req.file.filename), email);
        // console.log(req.file.filename)
        // res.status(200).send("บันทึกสำเร็จ");
    })
});

// Old import function 
// function OLDimportExelData2MySQL(res, filePath, email) {
//     readXlsxfile(filePath).then((rows) => {
//         let head = rows[0]
//         const date = new Date();
//         rows.shift();

//         let sql = "INSERT INTO item (`Asset_Number`,Inventory_Number,`Asset_Description`,`Model`,`Serial`,`Location`,`Room`,`Received_date`,`Original_value`,`Cost_center`,`Department`,`Vendor_name`,Year,Status, Email_Importer,Date_Upload) VALUES ?";
//         let sql2 = "DELETE from item WHERE Year=?"
//         var count = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
//         let result = []
//         for (var i = 0; i < rows.length; i++) {
//             var temp = rows[i];
//             rows[i] = [];

//             for (var j = 0; j < 12; j++) {
//                 rows[i].push(temp[count[j]]);
//                 if (j == 1) {
//                     result.push(temp[count[j]]);
//                 }
//             }
//             rows[i].push(d);
//             rows[i].push(0);
//             rows[i].push(email);
//             rows[i].push(date);
//         }
//         let sortre = result.sort();
//         let count_dup = 0
//         let duplicate = '';
//         for (let i = 0; i < sortre.length - 1; i++) {
//             if (sortre[i + 1] == sortre[i]) {
//                 count_dup++;
//                 duplicate = sortre[i];
//             }
//         }

//         var checkhead = ["Asset", "Inventory number", "Asset description", "ยี่ห้อ/รุ่น", "Serial number", "Location", "Room", "วันที่รับทรัพย์สิน", "Original value", "Cost Center", "หน่วยงาน", "Vendor Name1"];
//         let count_head = 0
        
//         for (let i = 0; i < count.length; i++) {
//             if (head[count[i]] != checkhead[i]) {
//                 // console.log(head[count[i]] + "  " + checkhead[i] + "  " + i)
//                 count_head++;
//             }
//         }
//         // console.log(count_dup)

//         if (count_dup == 0 && count_head == 0) {
//             con.query(sql2, [d], function (err, result, fields) {
//                 if (err) {
//                     console.log(err);
//                 }
//                 else {
//                     // res.send("delete")
//                     con.query(sql, [rows], function (err, result, fields) {
//                         if (err) {
//                             console.log(err);
//                             res.send("มีข้อมูลนี้แล้วในระบบ")
//                         }
//                         else {
//                             res.send("1")//บันทึกสำเสร็จ

//                         }
//                     })

//                 }
//             })
//         }
//         else {
//             res.send(duplicate)//ข้อมูลซ้ำหรือไม่ครบ
//         }
//     });
// }

// ======= read excel and insert to DB ==========
function importExelData2MySQL(res, filePath, email_importer) {
    // this module will read only the first sheet of Excel
    readXlsxfile(filePath).then((rows) => {
        // 'rows' is 2D array
        // the first row is header
        // read data must have at least 1 data row
        if(rows.length <= 1) {
            res.send("ไฟล์ที่อัพโหลดไม่มีข้อมูล");
            return;
        }

        // extract column (Inventory number)
        // 1. first, search whether this field exists at the first row
        const idx = rows[0].indexOf("Inventory number");
        // if this column is not found, data may be bad
        if(idx == -1) {
            res.send("ไฟล์ที่อัพโหลดมีรูปแบบที่ไม่ถูกต้อง, ไม่มี Inventory number");
            return;
        }
        // 2. keep the 'Inventory number' column in another 1D array
        let arr_ivn = [];
        rows.forEach((value) => {
            arr_ivn.push(value[idx]);
        });
        // 3. get array of duplicates
        // see https://stackoverflow.com/questions/840781/get-all-non-unique-values-i-e-duplicate-more-than-one-occurrence-in-an-array
        const arr_dup = arr_ivn.filter((value, index, arr) => arr.indexOf(value) !== index);
        // if duplicated inventory number
        if(arr_dup.length > 0) {
            // send dup array to notify user
            // res.status(500).json({"dup":arr_dup});
            res.send(arr_dup.join("\n"));
            return;
        }

        // Now data is good but need more processing       
        // 1. Delete the columns which do not match with the DB i.e. 'Company Code' and 'Subnumber'
        const idx1 = rows[0].indexOf("Company Code");
        const idx2 = rows[0].indexOf("Subnumber");
        // console.log(idx1, idx2);

        // 2. remove header row (field name)
        rows.shift();

        // 3. Insert fields that are required in DB but not available in input file
        // i.e. 'Year', 'Email_Importer', 'Date_Upload'
        const today = new Date();
        const currentYear = today.getFullYear();
        const yearBE = currentYear + 543;
        // const email_importer = 'usurapong@gmail.com';        
        // const dateUpload = `${currentYear}-${today.getMonth()+1}-${today.getDate()}`; 
        const dateUpload = currentYear + "-" + (today.getMonth()+1) + "-" + today.getDate();        

        // let finalData = [];        
        for(let i=0; i<rows.length; i++) {
            // remove 'Company Code'
            rows[i].splice(idx1, 1);
            // remove 'Subnumber'
            //we know that idx1 comes before idx2, after splicing idx1 we have to splice idx2-1
            rows[i].splice(idx2-1, 1);
            // add 'Year', 'Email_Importer', 'Date_Upload'
            rows[i].push(yearBE, email_importer, dateUpload);
        }
        // res.json(rows);
        // return;

        // Insert to DB
        // first delete existing data of current year
        con.beginTransaction(function(err) {
            if(err) {
                console.log(err);
                res.send("ไม่สามารถจัดการฐานข้อมูลได้");
                return; 
            }
            let sql = "DELETE from item WHERE Year=?";
            con.query(sql, [yearBE], function (err, result, fields) {
                if (err) {
                    console.log(err.code + ": " + err.sqlMessage);
                    res.send("ไม่สามารถลบข้อมูลเดิมจากฐานข้อมูลได้");
                    return;             
                }
                sql = "INSERT INTO `item`(`Asset_Number`, `Inventory_Number`, `Asset_Description`, `Model`, `Serial`,`Location`, `Room`,`Received_date`,`Original_value`,`Cost_center`,`Department`,`Vendor_name`,`Year`, `Email_Importer`, `Date_Upload`) VALUES ?";
                con.query(sql, [rows], function (err, result, fields) {
                    if (err) {
                        console.log(err.code + ": " + err.sqlMessage);
                        res.send("การนำเข้าข้อมูลสู่ฐานข้อมูลผิดพลาด");
                        return;             
                    }
                    con.commit(function (err) {
                        if(err) {
                            console.log(err.code + ": " + err.sqlMessage);
                            res.send("ไม่สามารถลบและนำเข้าสู่ฐานข้อมูลได้");
                            return; 
                        }
                        res.send("1");  //All good and done
                    });                    
                });
            });
        });
    });    
}

// ============= Upload if already upload ==============
router.post("/uploadif/:email", function (req, res) {
    const email = req.params.email
    upload(req, res, function (err) {
        if (err) {
            // An unknown error occurred when uploading.
            console.log(err);
            res.status(500).send("ไม่สามารถอัพโหลดไฟล์นี้ได้");
            return;
        }
        // Everything went fine.
        importfromexel(res, process.cwd() + '/upload/' + req.file.filename, email)
    })
});

// import
function importfromexel(res, filePath, email) {
    readXlsxfile(filePath).then((rows) => {
        rows.shift();
        const currentYear = new Date().getFullYear() + 543;
        const sql = "DELETE FROM item WHERE Year = ? ;"
        con.query(sql, [currentYear], function (err, result, fields) {
            if (err) {
                res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
                console.log(err)
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
            }
        })
    });
}

// บังคับถ่ายรูป
router.put("/item/take/:year", function (req, res) {
    const year = req.params.year;
    const Status = req.body.Status;
    const records = req.body.records;
    // console.log(Status)

    if (Status == 1) {
        const sql = "UPDATE item SET Takepicture = 1 where Year = ? AND Inventory_Number IN(?);"
        con.query(sql, [year, records], function (err, result, fields) {
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
        const sql = "UPDATE item SET Takepicture = 0 where Year = ? AND Inventory_Number IN(?) ;"
        con.query(sql, [year, records], function (err, result, fields) {
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
router.put("/item/addImage", function (req, res) {
    const image = req.body.image;
    const Inventory_Number = req.body.Inventory_Number;
    const sql = "UPDATE item SET Image=? where Inventory_Number=?;"
    con.query(sql, [image, Inventory_Number], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        }
        else {
            res.send("แก้ไขข้อมูลเรียบร้อย");
        }
    })
});

// Load info of all user 
router.get("/manageUser/showAllUsers/:Email_user", function (req, res) {
    const Email_user = req.params.Email_user;
    // const Year =  new Date().getFullYear();
    const sql = "select Year,Email_user,Email_assigner,Role from year_user WHERE Email_user = ? ORDER BY Year DESC"

    con.query(sql, [Email_user], function (err, result, fields) {
        if (err) {
            console.log(err);
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
router.get("/adminhistorytableEmailCommittee/info/:year", function (req, res) {
    const Year = req.params.year;
    const sql = "SELECT DISTINCT Email_Committee FROM item WHERE Year = ? AND Email_Committee IS NOT NULL "
    con.query(sql, [Year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)

        }
    })
});

// // Load info of commitee
router.get("/adminhistorytableEmailCommittee/infoshow", function (req, res) {
    const sql = "SELECT DISTINCT Email_Committee, Year FROM item WHERE Email_Committee IS NOT NULL ORDER BY Year DESC";
    con.query(sql, function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)

        }
    })
});

// // Load info of Year that scaned
router.get("/adminhistorytableEmailCommittee/year", function (req, res) {
    const sql = "SELECT DISTINCT Year FROM item WHERE Email_Committee IS NOT NULL ORDER BY Year"
    con.query(sql, function (err, result, fields) {
        if (err) {
            console.log(err);
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
router.get("/adminhistorytable/info/:EmailCommittee/:year", function (req, res) {
    const Email_Committee = req.params.EmailCommittee;
    const year = req.params.year;
    const sql = "SELECT COUNT(Inventory_Number) AS num FROM item WHERE Email_Committee = ? and Year = ?"

    con.query(sql, [Email_Committee, year], function (err, result, fields) {
        if (err) {
            console.log(err);
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
router.get("/EmailCommitteename/info/:Email_name", function (req, res) {
    const Email_user = req.params.Email_name;
    const sql = "SELECT Email_user FROM year_user WHERE Email_user = ?"
    con.query(sql, [Email_user], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)

        }
    })
});

// Get committee's email and his/her amount of items checked
router.get("/committee/checkedItems/:year", function(req, res) {
    const sql = "SELECT Email_Committee, COUNT(Inventory_Number) AS num FROM item WHERE Year = ? AND Email_Committee IS NOT NULL GROUP BY Email_Committee";
    con.query(sql, [req.params.year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result);
        }
    });
});


// Load inspected total item numbers by a user
router.get("/user/profile/inspectedItem/Total/Number1/:Email_Committee", function (req, res) {
    const Email_Committee = req.params.Email_Committee;
    const sql = "SELECT count(Status) AS 'Numbers_of_Inspected_Item' FROM item WHERE Email_Committee=? AND Year =?;"

    con.query(sql, [Email_Committee, d], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Loadnumber people scan in that day
router.get("/user/datescan", function (req, res) {
    const Year = new Date().getFullYear();
    const sql = "SELECT Date_Scan FROM item WHERE Year = ? AND Date_Scan IS NOT NULL ;"

    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load inspected total item numbers by a user
router.get("/user/profile/inspectedItem/Total/Number/:Email_Committee", function (req, res) {
    const Email_Committee = req.params.Email_Committee;
    const sql = "SELECT count(Status) AS 'Numbers_of_Inspected_Item' FROM item WHERE Email_Committee=?;"

    con.query(sql, [Email_Committee], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load inspected item numbers of status by user
router.get("/user/profile/inspectedItem/:Status/:Email_Committee", function (req, res) {
    const Email_Committee = req.params.Email_Committee;
    const Status = req.params.Status;
    const sql = "SELECT count(Status) AS 'Numbers_of_Inspected_Item' FROM item WHERE Status=? AND Email_Committee=?;"

    con.query(sql, [Status, Email_Committee], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});
// Load Year
router.get("/Year/user", function (req, res) {
    const sql = "SELECT DISTINCT Year FROM year_user ORDER BY Year DESC"

    con.query(sql, function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load date scan
router.get("/datescan/user", function (req, res) {
    const Year = new Date().getFullYear();
    const sql = "SELECT DISTINCT Date_Scan FROM item where Year = ? AND Date_scan IS NOT NULL ORDER BY Date_scan "
    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load Year
router.get("/Year/iteem", function (req, res) {
    const sql = "SELECT DISTINCT Year FROM item ORDER BY Year "

    con.query(sql, function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});


// Load Year



// Add info of new user in manage user page
router.put("/manageUser/update/:Email_user/:Email_assigner/:Role/:Email_useru", function (req, res) {

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
router.put("/manageUser/updatename/:Name/:Email_user", function (req, res) {
    const Name = req.params.Name;
    const Email_user = req.params.Email_user;

    const sql = "UPDATE year_user SET Name = ? WHERE Email_user = ?;";
    con.query(sql, [Name, Email_user], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        }
        else {
            res.send("แก้ไขข้อมูลเรียบร้อย");
        }
    })
});

// Load email of user
router.get("/user/index/info/emailUser/:Email_user", function (req, res) {
    const Email_user = req.params.Email_user;
    const sql = "SELECT Email_user FROM `year_user` WHERE Email_user=?;"

    con.query(sql, [Email_user], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load inspected item by the user
router.get("/user/profile/inspectedInfoItem/:Email_Committee", function (req, res) {
    const Email_Committee = req.params.Email_Committee;
    const sql = "select Image,Inventory_Number,Received_date,Date_scan,Model,Date_Scan,Department,Date_Upload,Status,Email_Committee from item where Email_Committee=?;"

    con.query(sql, [Email_Committee], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load all item info
router.get("/item/dashboard/showAllInfo", function (req, res) {
    const sql = "select * from item"

    con.query(sql, function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load all item for import
router.get("/item/dashboard/showuser", function (req, res) {
    const sql = "select DISTINCT Status from item WHERE Year = ?;"

    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load all item info with location

router.get("/item/dashboard/showAllInfo/:location/:email/:year", function (req, res) {
    const location = req.params.location;
    const email = req.params.email;
    const year = req.params.year;
    const sql = "select * FROM item WHERE Location = ? AND Email_Committee = ? AND Year = ?"

    con.query(sql, [location, email, year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)

        }
    })
});

// Load all item info with location
router.get("/item/dashboard/showAllInfoall/:location/:year", function (req, res) {
    const location = req.params.location;
    const year = req.params.year;
    const sql = "select * FROM item WHERE Location = ? AND Year = ?"

    con.query(sql, [location, year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)

        }
    })
});

// Load all item info with location

router.get("/item/dashboard/showAllInfoall/:location/:year", function (req, res) {
    const location = req.params.location;
    const year = req.params.year;
    const sql = "select * FROM item WHERE Location = ? AND Year = ?"

    con.query(sql, [location, year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load all item info with location with normal status
router.get("/item/dashboard/showAllInfonormal/:location/:Year", function (req, res) {
    const location = req.params.location;
    const Year= req.params.Year
    const sql = "select * FROM item WHERE Location = ? AND Status = 1 AND Year = ?"

    con.query(sql, [location, Year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load item numbers
router.get("/item/dashboard/number/:status", function (req, res) {
    const sql = "SELECT count(Status) AS 'Numbers_of_item' FROM item WHERE Status=?;"
    const Year = new Date().getFullYear();
    const status = req.params.status;
    con.query(sql, [status, Year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load all item info with location
router.get("/item/dashboard/showAllInfo/:Room/:year", function (req, res) {
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
router.get("/item/dashboard/number", function (req, res) {
    const sql = "SELECT count(Status) AS 'Numbers_of_item' FROM item ;"
    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load item numbers 
router.get("/item/dashboard/number2/:status/:Year", function (req, res) {
    const sql = "SELECT count(Status) AS 'Numbers_of_item' FROM item WHERE Status=? AND Year = ?;"
    const Year = req.params.Year;
    const email = req.params.email;
    const status = req.params.status;
    con.query(sql, [status, Year, email], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load item numbers with Year
router.get("/item/dashboard/number2user/:status/:Year/:email", function (req, res) {
    const sql = "SELECT count(Status) AS 'Numbers_of_item' FROM item WHERE Status=? AND Year = ? AND Email_Committee = ?;"
    const Year = req.params.Year;
    const email = req.params.email;
    const status = req.params.status;
    con.query(sql, [status, Year, email], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load item numbers Year
router.get("/item/dashboard/number1/:Year", function (req, res) {
    const sql = "SELECT count(Status) AS 'Numbers_of_item' FROM item WHERE Year = ?;"
    const Year = req.params.Year;
    con.query(sql, [Year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});


// Load item numbers Year
router.get("/item/dashboard/number1all/:Year/:email", function (req, res) {
    const sql = "SELECT count(Status) AS 'Numbers_of_item' FROM item WHERE Year = ? AND Email_Committee = ?;"
    const Year = req.params.Year;
    const email = req.params.email;
    con.query(sql, [Year, email], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});


// // Load location
router.get("/item/Location/:year", function (req, res) {
    const year = req.params.year
    const sql = "SELECT DISTINCT Location FROM item where Year = ?"


    con.query(sql, [year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// // Load Room
router.get("/item/Room/:year", function (req, res) {
    const year = req.params.year
    const sql = "SELECT DISTINCT Room FROM item where Year = ?"

    con.query(sql, [year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// // Load location
router.get("/item/location/:email/:year", function (req, res) {
    const email = req.params.email;
    const year = req.params.year;
    const sql = "SELECT DISTINCT Location FROM item WHERE Email_Committee = ? AND Year = ?;"

    con.query(sql, [email, year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// // Load location
router.get("/item/Locationnormal", function (req, res) {
    const sql = "SELECT DISTINCT Location FROM item WHERE Status = 1 AND Year = ?"
    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            if (result.length === 0) {
                con.query(sql, [d - 1], function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
                    } else {
                        res.json(result);
                    }
                })
            } else {
                res.json(result)
            }
        }
    })
});

// // Load Status
router.get("/item/Status/:year", function (req, res) {
    const year = req.params.year
    const sql = "SELECT DISTINCT Status FROM item where year=?"

    con.query(sql, [year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// // Load Status
router.get("/item/Status/:email/:year", function (req, res) {
    const email = req.params.email;
    const year = req.params.year;
    const sql = "SELECT DISTINCT Status FROM item WHERE Email_Committee = ? AND Year =?"

    con.query(sql, [email, year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load all item info with Status



router.get("/item/dashboard/showAllInfo1/:status/:email/:year", function (req, res) {
    const status = req.params.status;
    const email = req.params.email;
    const year = req.params.year;
    const sql = "select * from item WHERE Status = ? AND Email_Committee = ? AND Year =?"

    con.query(sql, [status, email, year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result);
        }
    })
});


// Load all item info with Status no email

router.get("/item/dashboard/showAllInfostatus/:status/:year", function (req, res) {
    const status = req.params.status;
    const year = req.params.year;
    const sql = "select * from item WHERE Status = ? AND Year =?"

    con.query(sql, [status, year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result);
            // console.log(status)
        }
    })
});

// // Load Year
router.get("/item/Year", function (req, res) {
    const sql = "SELECT DISTINCT Year FROM item ORDER BY Year DESC"

    con.query(sql, function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    });
});


// // Load Year
router.get("/item/Yearuser/:email", function (req, res) {
    const email = req.params.email;
    const sql = "SELECT DISTINCT Year FROM item WHERE Email_Committee=? ORDER BY Year DESC"

    con.query(sql, [email], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});


// Load all item info with Year
router.get("/item/dashboard/showAllInfo4/:Year", function (req, res) {
    const Year = req.params.Year;
    const sql = "select * from item WHERE Year = ?"

    con.query(sql, [Year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});


// Load all item info with Year email
router.get("/item/showAllInfoall/:Year/:email", function (req, res) {
    // /item/dashboard/number1all/
    const Year = req.params.Year;
    const email = req.params.email;
    // console.log(email + Year)

    const sql = "select * from item WHERE Year =? AND Email_Committee = ?"

    con.query(sql, [Year, email,], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
            // console.log("Success")
        }
    })
});


// // Load commitee
router.get("/item/Email_Committee/:year", function (req, res) {
    const year = req.params.year;
    const sql = "SELECT DISTINCT Email_Committee FROM item where Email_Committee is NOT NULL and Year = ? ORDER BY Email_Committee"

    con.query(sql, [year], function (err, result, fields) {
        if (err) {
            console.log(err);            
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load all item info with commitee
router.get("/item/dashboard/showAllInfo3/:Email_Committee/:Year", function (req, res) {
    const thecommittee = req.params.Email_Committee;
    const committee_year = req.params.Year;
    const sql = "select * from item WHERE Email_Committee  = ? and Year = ?"

    con.query(sql, [thecommittee, committee_year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load item info
router.get("/item/:status", function (req, res) {
    const sql = "select Image,Inventory_Number,Model,Serial,Location,Received_date,Original_value,Department,Vendor_name,Date_Upload,Date_scan,Email_Committee,Status from item where Status=? AND Year =?"
    const Year = new Date().getFullYear();
    const status = req.params.status;
    con.query(sql, [status, Year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});
// UPDATE item,Year_user SET item.Status=? where item.Inventory_Number=? AND Year_user.Email_user=?
// For print barcode or QR code of item
router.get("/item/forPrintQRcode_Barcode/:Email_Committee", function (req, res) {
    const sql = "select Inventory_Number, Asset_Description, Received_date, Department, Year,Status, Image from item where Year=? and Email_Committee=?;"
    const Year = new Date().getFullYear();
    const Email_Committee = req.params.Email_Committee;
    con.query(sql, [d, Email_Committee], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load some info of item of landing1
router.get("/landing1/showSomeInfo", function (req, res) {
    const sql = "select Inventory_Number,Asset_description,Received_date,Department,Image from item"

    con.query(sql, function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load all info of item of landing1
router.get("/landing1/showAllInfo", function (req, res) {
    const sql = "select Inventory_Number,Status,Model,Location,Original_value,Email_Committee,Cost_center,Serial,Date_Upload,Asset_description,Received_date,Department,Image from item"

    con.query(sql, function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load some info of item of landing2
router.get("/landing2/showSomeInfo", function (req, res) {
    const sql = "select Inventory_Number,Status,Model,Cost_center,Received_date,Department,Image from item"

    con.query(sql, function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load item number all in database
router.get("/item/numberAll", function (req, res) {
    const Year = new Date().getFullYear();
    const sql = "SELECT count(Status) AS 'Numbers_of_Inspected_Item' FROM item WHERE Year = ?"
    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.send(result)
        }
    })
});

// Load date and time of job
router.get("/dateTime/showDateTime", function (req, res) {
    const sql = "select * from date_check where Years = ?"

    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            console.log(err);
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
router.get("/maindataTable/info/:status/:Year", function (req, res) {
    const sql = "select Image,Asset_Description,Inventory_Number,Model,Serial,Location,Received_date,Original_value,Cost_center,Room,Department,Vendor_name,Date_Upload,Date_scan,Email_Committee,Status,Date_Scan from item where Status=? and  Year=?"
    const Year = req.params.Year;
    const status = req.params.status;
    con.query(sql, [status, Year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Edit status of item
router.put("/item/edit", function (req, res) {
    const Status = req.body.Status;
    const Inventory_Number = req.body.Inventory_Number;
    const Email_user = req.body.Email_user;
    const sql = "UPDATE item,year_user SET item.Status=? where item.Inventory_Number=? AND year_user.Email_user=?;"
    con.query(sql, [Status, Inventory_Number, Email_user], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        }
        else {
            res.send("แก้ไขข้อมูลเรียบร้อย");
        }
    })
});

// delete user 
router.delete("/manageUser/deleteAllUser/:Email", function (req, res) {
    const Email = req.params.Email;

    const sql = "DELETE from year_user WHERE Email_user = ? AND Year=?"
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
router.delete("/manageItem/deleteAllitem", function (req, res) {

    const Year = new Date().getFullYear();
    const sql2 = "DELETE from item WHERE Year=?"
    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load info of all user of manage user page
router.get("/manageUser/showAllUser/:Year", function (req, res) {
    const Year = req.params.Year;
    const sql = "select Year,Email_user,Email_assigner,Role,Name from year_user WHERE Year=? "

    con.query(sql, [Year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load mane
router.get("/manageUser/showAlladminname", function (req, res) {
    Email_assigner = req.params.Email_assigner;
    const sql = "select * from year_user WHERE Role = 1";

    con.query(sql, function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result);
        }
    });
});

// Add info of new user in manage user page
router.post("/manageUser/add/:Email_user/:Email_assigner/:Role", function (req, res) {
    const Year = new Date().getFullYear();
    const Email_user = req.params.Email_user;
    const Email_assigner = req.params.Email_assigner;
    const Role = req.params.Role;

    const sql = "INSERT INTO year_user(Year,Email_user,Email_assigner,Role) VALUES (?,?,?,?)";
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
router.get("/con/:Inventory_Number/:Year", function (req, res) {
    const sql = "SELECT Image,Inventory_Number,Model,Serial,Location,Received_date,Asset_Description,Room,Original_value,Cost_center,Department,Vendor_name,Date_Upload,Date_scan,Email_Committee,Status,Date_Scan FROM `item` WHERE `Inventory_Number` =? AND Year =?"
    const Year = req.params.Year;
    const Inventory_Number = req.params.Inventory_Number;
    con.query(sql, [Inventory_Number, Year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// Load item info landing 2
router.get("/item5/:Inventory_Number/:Year", function (req, res) {
    const sql = "SELECT Image,Inventory_Number,Model,Serial,Location,Received_date,Asset_Description,Room,Original_value,Cost_center,Department,Vendor_name,Date_Upload,Date_scan,Email_Committee,Status,Date_Scan FROM `item` WHERE `Inventory_Number` =? AND Year =?"
    const Year = req.params.Year;
    const Inventory_Number = req.params.Inventory_Number;
    con.query(sql, [Inventory_Number, Year], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

router.get("/numberitem", function (req, res) {
    const Year = new Date().getFullYear();
    const sql = "SELECT count(Inventory_Number) AS numofitem FROM item WHERE Year = ?"
    con.query(sql, [d], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.send(result)
        }
    })
});

// Insert Work Time
router.post("/dateTime/insertTime/:Date_start/:Date_end", function (req, res) {
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
router.put("/dateTime/updateTime/:Date_start/:Date_end", function (req, res) {

    const Date_start = req.params.Date_start;
    const Date_end = req.params.Date_end;
    const sql = "UPDATE date_check SET Date_start=?, Date_end=? where Years=?;"
    con.query(sql, [Date_start, Date_end, d], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        }
        else {
            res.send("แก้ไขข้อมูลเรียบร้อย");
        }
    })
});

// Load announement
router.get("/Loadannounce", function (req, res) {
    // const Year = new Date().getFullYear();
    const sql = "SELECT * FROM `announcement` ORDER BY `Number`  DESC"
    con.query(sql, function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.send(result)
        }
    })
});

// upload photo announce
router.post("/UploadingPhoto", function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            // An unknown error occurred when uploading.
            console.log(err);
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
router.post("/AddAnnounce/:EmailOwner", function (req, res) {
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
router.put("/EditAnnounce/:EmailOwner/:Number1", function (req, res) {
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
router.delete("/DeleteAnnounce/:Number1", function (req, res) {
    // const EmailOwner = req.params.EmailOwner
    const Number1 = req.params.Number1

    const sql = "DELETE FROM `announcement` WHERE `announcement`.`Number` = ?"
    con.query(sql, [Number1], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง")
            console.log(err);
        }
        else {
            if (result.affectedRows != 1) {
                res.status(503).send("Delete Failed");
            }
            else {
                res.send("/announce");
                // console.log("Delete Successed")
            }
        }
    })
});

module.exports = router;