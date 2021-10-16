var table
var user
var SelectedYear
var YearFilter
$(document).ready(function () {
    var yyyy = new Date().getFullYear() + 543;
    $(".atyear1").html(yyyy)
    $("form").submit(function (e) {
        e.preventDefault();
        fileName = $("#fileUpload").val();
        fileExtension = fileName.replace(/^.*\./, '');

        if (document.getElementById("fileUpload").files.length == 0) {
            //or use jQuery
            swal({
                title: "กรุณาเลือกไฟล์",
                type: "info",
                confirmButtonClass: "btn-primary rounded",
                confirmButtonText: "ตกลง",
                closeOnConfirm: true,
            })

            return;
        }
        else if (fileExtension != "xlsx") {
            // alert("please select only excel file");
            swal({
                title: "กรุณาเลือกเฉพาะไฟล์ Excel",
                type: "info",
                confirmButtonClass: "btn-primary rounded",
                confirmButtonText: "ตกลง",
                closeOnConfirm: true,
            })
        }
        else {
            const formData = new FormData(this);
            var today = new Date();

            $.ajax({
                method: "GET",
                url: "/api/item/dashboard/showuser" //ดึง status ex: [{"Status":0}]
            }).done(function (data, state, xhr) {

                if (data.length > 1) {
                    swal({
                        title: "ไม่สามารถนำเข้าไฟล์เพิ่มเติม",
                        text: "เนื่องจากปีนี้ได้ทำการตรวจนับแล้ว",
                        type: "info",
                        showCancelButton: false,
                        confirmButtonClass: "btn-primary rounded",
                        // cancelButtonClass: "btn-primary",
                        confirmButtonText: "ตกลง",
                        // cancelButtonText: "ยกเลิก",
                        closeOnConfirm: true,
                        // closeOnCancel: true
                    })
                } else {
                    $.ajax({
                        method: "GET",
                        url: "/api/item/dashboard/showuser"
                    }).done(function (dataSet, state, xhr) {
                        if (dataSet.length != 0) {
                            swal({
                                title: "ปีนี้ได้มีการนำเข้าไฟล์แล้ว",
                                text: "ถ้านำเข้าซ้ำ จะทำการล้างข้อมูลเก่าทั้งหมด",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonClass: "btn-danger rounded",
                                cancelButtonClass: "btn-primary rounded",
                                confirmButtonText: "ยืนยัน",
                                cancelButtonText: "ยกเลิก",
                                closeOnConfirm: false,
                                closeOnCancel: true,
                                showLoaderOnConfirm: true
                            },
                                function (isConfirm) {
                                    setTimeout(function () {
                                        if (isConfirm) {
                                            $.ajax({
                                                method: "POST",
                                                url: "/api/uploading/" + user,
                                                data: formData,
                                                contentType: false,     //tell jQuery not to add a Content-Type header for us
                                                processData: false,      //tell jQuery not to convert the formData object to a string
                                                success: function (data, state, xhr) {
                                                    if (data == '1') {
                                                        swal({
                                                            title: "<small>บันทึกสำเร็จ</small>",
                                                            // text: "บันทึกสำเร็จ",
                                                            type: "success",
                                                            showCancelButton: false,
                                                            confirmButtonClass: "btn-success rounded",
                                                            confirmButtonText: "ยืนยัน",
                                                            // closeOnConfirm: false,
                                                            closeOnConfirm: true,
                                                            html: true,
                                                            closeOnCancel: true
                                                        }, function (isConfirm) {
                                                            window.location.reload()
                                                        });
                                                    }
                                                    else {
                                                        swal({
                                                            title: "นำเข้าเอกสารล้มเหลว",
                                                            text: "ข้อมูลซ้ำหรือไม่ครบ \n" + data,
                                                            type: "error",
                                                            showCancelButton: false,
                                                            confirmButtonClass: "btn-primary rounded",
                                                            // cancelButtonClass: "btn-primary",
                                                            confirmButtonText: "ตกลง",
                                                            // cancelButtonText: "ยกเลิก",
                                                            closeOnConfirm: true,
                                                            // closeOnCancel: true
                                                        }, function (isConfirm) {
                                                            window.location.reload()
                                                        });
                                                    }
                                                },
                                                error: function (xhr, state, err) {
                                                    $(".btn-sm").hide();
                                                    $(".but").append('<input class="btn btn-sm" type="button" value = "ตกลง" onclick = "location.reload()" style="float: right; background-color: #0a72c1; color:white">')
                                                    $(".alertText").html(xhr.responseText)
                                                    $("#alertmodal").modal();
                                                }
                                            });
                                        }
                                    }, 2000);
                                });
                        }
                        else {
                            swal({
                                title: "ยืนยันนำเข้าข้อมูล",
                                // text: "Submit to run ajax request",
                                type: "info",
                                showCancelButton: true,
                                showLoaderOnConfirm: true,
                                closeOnCancel: true,
                                closeOnConfirm: false,
                                cancelButtonClass: "btn-secondary rounded",
                                cancelButtonText: "ยกเลิก",
                                confirmButtonText: "ยืนยัน",
                            }, function (isConfirm) {
                                setTimeout(function () {
                                    // swal("Ajax request finished!");
                                    // swal("Good job!", "You clicked the button!", "success")
                                    if (isConfirm) {

                                        $.ajax({
                                            method: "POST",
                                            url: "/api/uploading/" + user,
                                            data: formData,
                                            contentType: false,     //tell jQuery not to add a Content-Type header for us
                                            processData: false,      //tell jQuery not to convert the formData object to a string
                                            success: function (data, state, xhr) {
                                                if (data == '1') {
                                                    swal({
                                                        title: "<small>บันทึกสำเร็จ</small>",
                                                        // text: "บันทึกสำเร็จ",
                                                        type: "success",
                                                        showCancelButton: false,
                                                        confirmButtonClass: "btn-success rounded",
                                                        confirmButtonText: "ยืนยัน",
                                                        // closeOnConfirm: false,
                                                        closeOnConfirm: true,
                                                        html: true,
                                                        closeOnCancel: true
                                                    }, function (isConfirm) {
                                                        window.location.reload()
                                                    });
                                                }
                                                else {
                                                    swal({
                                                        title: "นำเข้าเอกสารล้มเหลว",
                                                        text: "ข้อมูลซ้ำหรือไม่ครบ(" + data + ')',
                                                        type: "error",
                                                        showCancelButton: false,
                                                        confirmButtonClass: "btn-primary rounded",
                                                        // cancelButtonClass: "btn-primary",
                                                        confirmButtonText: "ตกลง",
                                                        // cancelButtonText: "ยกเลิก",
                                                        closeOnConfirm: true,
                                                        // closeOnCancel: true
                                                    }, function (isConfirm) {
                                                        window.location.reload()
                                                    });
                                                }
                                            },
                                            error: function (xhr, state, err) {
                                                $(".btn-sm").hide();
                                                $(".but").append('<input class="btn btn-sm" type="button" value = "ตกลง" onclick = "location.reload()" style="float: right; background-color: #0a72c1; color:white">')
                                                $(".alertText").html(xhr.responseText)
                                                $("#alertmodal").modal();
                                            }
                                        });
                                    }
                                }, 2000);
                            });
                        }
                    })
                }
            }).fail(function (xhr, state, error) {
                $(".alertText").html(xhr.responseText)
                $("#alertmodal").modal();
            });
        }
    });

    // //==================== drop down year ===================
    $.ajax({
        method: "GET",
        url: "/api/item/Year"
    }).done(function (data, state, xhr) {
        if (data.length == 0) {
            getItem();
        } else {
            selectedyear = data[0].Year
            var values = [];
            for (let i = 0; i < data.length; i++) {
                values[i] = [data[i].Year]
            }
            // values[data.length] = data[0].Year
            // $('.fixyear').toggleClass("a");
            $('.fixyear').removeClass("input-group ml-5 mt-3");
            // $('.fixyear').toggleClass("fixyear input-group mt-1");
            $('.fixyear').addClass("fixyear input-group ml-3 mt-3");
            $('.year').append($(document.createElement('select')).prop({
                class: 'year',
                name: 'year',
                style: 'border-color: white',
                // class: ' year',
                id: 'Year',
                name: 'Year'
            })
            )

            //drop down status year
            for (let i = 0; i <= values.length - 1; i++) {
                $('#Year').append($(document.createElement('option')).prop({
                    value: values[i],
                    text: values[i],
                    // class: values[i]
                }))
            }

            getItem();
            $('.ปีตรวจ').hide()

            $('select.year').change(function () {
                var selected = $(this).children("option:selected").val();
                SelectedYear = selected
                // SelectedYear = $("#Year").val();
                // alert(SelectedYear)
                $("#Location").children().remove().end().append('<option selected id="hidelocation" value="สถานที่">สถานที่</option>');
                $("#Status").children().remove().end().append('<option selected id="hidestatus" value="สถานะ">สถานะ</option>');
                $("#Email_Committee").children().remove().end().append('<option selected id="hidecommittee" value="คณะกรรมการผู้ตรวจสอบ">คณะกรรมการผู้ตรวจสอบ</option>');
                $("#Room").children().remove().end().append('<option selected id="hideroom" value="ห้อง">ห้อง</option>');
                $.ajax({
                    method: "GET",
                    url: "/api/item/dashboard/showAllInfo4/" + selected
                }).done(function (dataSet, state, xhr) {
                    getItem()
                }).fail(function (xhr, state, error) {
                })
            })
        }
    })

    $("#all").click(function () {
        window.location.replace("/api/information");
    });

    //======================= เปลี่ยน font PDF ========================
    pdfMake.fonts = {
        THSarabun: {
            normal: 'THSarabun.ttf',
            bold: 'THSarabun-Bold.ttf',
            italics: 'THSarabun-Italic.ttf',
            bolditalics: 'THSarabun-BoldItalic.ttf'
        }
    }
    //======================= เปลี่ยน font PDF จบ ========================

    //=======================สร้างโครง DataTable =========================
    table = $('#myTable').DataTable({
        'columnDefs': [
            {
                'targets': 0,
                'checkboxes': {
                    'selectRow': true
                }
            }
        ],
        'select': {
            'style': 'multi',
            // 'selector': 'td:first-child'
        },
        'order': [[1, 'asc']],
        deferRender: true,
        columns: [
            // { className: "my_class", "targets": [2] },
            { data: "Inventory_Number" },//0
            { data: "Asset_Number", title: "Asset_Number", "visible": false },//1
            {
                "mData": "Image", title: "รูปภาพ",
                "render": function (data) {
                    return '<img class="pic" src="' + data + '" style="width: 100px;margin: 25px;-webkit-transition: all .4s ease-in-out;-moz-transition: all .4s ease-in-out;-o-transition: all .4s ease-in-out; -ms-transition: all .4s ease-in-out; "  />';
                }
                , className: "classimg",
            },
            { data: "Inventory_Number", title: "รหัสครุภัณฑ์", className: "classimg" },//3
            { data: "Asset_Description", title: "ชื่อครุภัณฑ์", className: "classimg" },//4
            { data: "Model", title: "ยี่ห้อ/รุ่น", "visible": false },//5
            { data: "Serial", title: "Serial number", "visible": false },//6
            { data: "Location", title: "สถานที่", className: "classimg" },//7
            { data: "Room", title: "ห้อง", className: "classimg" },//8
            { data: "Received_date", title: "วันที่รับทรัพย์สิน", "visible": false },//9
            { data: "Original_value", title: "Original value", "visible": false },//10
            { data: "Cost_center", title: "Cost Center", "visible": false },//11
            { data: "Department", title: "หน่วยงาน", "visible": false },//12
            { data: "Vendor_name", title: "Vendor Name1", "visible": false },//13
            { data: "Takepicture", title: "ถ่ายรูป", className: "classimg" },//14
            { data: "Date_scan", title: "วันที่ตรวจสอบ", className: "classimg" },//15
            { data: "Email_Committee", title: "ผู้ตรวจสอบ", className: "classimg" },//16
            { data: "Status", title: "สถานะ", className: "classimg" },//17
            { data: "Received_date", title: "วันที่รับสินทรัพย์", className: "classimg" },//17
        ],
    });

    var aa = new $.fn.dataTable.Buttons(table, {
        "buttons": [
            {
                "extend": 'excel',
                "exportOptions": {
                    "columns": [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17]
                },
            },
            { // กำหนดพิเศษเฉพาะปุ่ม pdf
                "extend": 'pdf', // ปุ่มสร้าง pdf ไฟล์
                "text": 'PDF', // ข้อความที่แสดง
                "pageSize": 'A4',   // ขนาดหน้ากระดาษเป็น A4 
                "exportOptions": {
                    "columns": [3, 4, 7, 8, 10, 15, 16, 17]
                },
                "customize": function (doc) { // ส่วนกำหนดเพิ่มเติม ส่วนนี้จะใช้จัดการกับ pdfmake
                    // กำหนด style หลัก
                    doc.defaultStyle = {
                        font: 'THSarabun',
                        fontSize: 16
                    };
                    doc.styles.tableHeader.fontSize = 16
                    // กำหนดความกว้างของ header แต่ละคอลัมน์หัวข้อ
                    doc.content[1].table.widths = ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'];
                }
            }, // สิ้นสุดกำหนดพิเศษปุ่ม pdf
            {
                "extend": 'print',
                "exportOptions": {
                    "columns": [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17]
                },

            },
            // 'print'
        ],
    }).container().appendTo($('#ExportFile'));

    //======================= สร้างโครง DataTable จบ =========================


    //============================ Take photo ===========================
    $("#TakePhoto").click(function () {
        var rows_selected = table.column(0).checkboxes.selected();
        let rowdata = rows_selected.join(",")
        const arr = rowdata.split(",");
        SelectedYear = $("#Year").val();
        var takephoto = $("#TakePhoto").val();

        // if user chooses 0-20 products
        // we prevent select too many products which will crash data submission
        if (rows_selected.length != 0 && rows_selected.length <= 20) {
            // console.log(arr);
            $.ajax({
                method: "put",
                url: "/api/item/take/" + SelectedYear,
                data: { records: arr, status: takephoto },
                success: function (response) {
                    swal({
                        title: "<small>บันทึกสำเร็จ</small>",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonClass: "btn-success rounded",
                        confirmButtonText: "ยืนยัน",
                        closeOnConfirm: true,
                        html: true,
                        closeOnCancel: true
                    },
                        function (isConfirm) {
                            if (isConfirm) {
                                window.location.reload()
                            }
                        });
                }
            });
        }
        else {
            swal({
                title: "กรุณาเลือกข้อมูลตั้งแต่ 1-20 รายการ",
                type: "info",
                showCancelButton: false,
                confirmButtonClass: "btn-primary rounded",
                confirmButtonText: "ตกลง",
                closeOnConfirm: true,
            })
        }
    });

    // Take photo all
    $("#TakePhotoAll").click(function () {
        $.ajax({
            method: "put",
            url: "/api/item/takeAll/" + SelectedYear + "/1",
            // data: { records: arr, status: takephoto },
            success: function (response) {
                swal({
                    title: "<small>บันทึกสำเร็จ</small>",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonClass: "btn-success rounded",
                    confirmButtonText: "ยืนยัน",
                    closeOnConfirm: true,
                    html: true,
                    closeOnCancel: true
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            window.location.reload()
                        }
                    });
            }
        });
    });
    //============================ Take photot จบ ===========================

    //============================ No Take photo ===========================
    $("#NoTakePhoto").click(function (e) {
        var rows_selected = table.column(0).checkboxes.selected();
        let rowdata = rows_selected.join(",")
        const arr = rowdata.split(",");
        SelectedYear = $("#Year").val();
        var NoTakePhoto = $("#NoTakePhoto").val();

        // if user chooses 0-20 products
        // we prevent select too many products which will crash data submission
        if (rows_selected.length != 0 && rows_selected.length <= 20) {
            $.ajax({
                method: "put",
                url: "/api/item/take/" + SelectedYear,
                data: { records: arr, status: NoTakePhoto },
                success: function (response) {
                    swal({
                        title: "<small>บันทึกสำเร็จ</small>",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonClass: "btn-success rounded",
                        confirmButtonText: "ยืนยัน",
                        closeOnConfirm: true,
                        html: true,
                        closeOnCancel: true
                    },
                        function (isConfirm) {
                            if (isConfirm) {
                                getItem();
                            }
                        });
                }
            });

        }
        else {
            swal({
                title: "กรุณาเลือกข้อมูลตั้งแต่ 1-20 รายการ",
                type: "info",
                showCancelButton: false,
                confirmButtonClass: "btn-primary rounded",
                // cancelButtonClass: "btn-primary",
                confirmButtonText: "ตกลง",
                // cancelButtonText: "ยกเลิก",
                closeOnConfirm: true,
                // closeOnCancel: true
            })
        }
    });

    // Don't take any photo
    $("#NoTakePhotoAll").click(function () {
        $.ajax({
            method: "put",
            url: "/api/item/takeAll/" + SelectedYear + "/0",
            // data: { records: arr, status: takephoto },
            success: function (response) {
                swal({
                    title: "<small>บันทึกสำเร็จ</small>",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonClass: "btn-success rounded",
                    confirmButtonText: "ยืนยัน",
                    closeOnConfirm: true,
                    html: true,
                    closeOnCancel: true
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            window.location.reload()
                        }
                    });
            }
        });
    });
    //============================ No Take photo จบ ===========================

    $.ajax({
        method: "GET",
        url: "/api/profile/infouser"
    }).done(function (data, state, xhr) {
        user = data.email
        $("#user").html(data.name);
        document.getElementById('pic').src = data.photo;
        if (data.email === undefined) {
            window.location.replace("/api/checkpage")
        } else {
            $.ajax({
                method: "GET",
                url: "/api/manageUser/showAllUsers/" + data.email
            }).done(function (dataSet, state, xhr) {
                if (dataSet[0] === undefined || dataSet[0].data === 0) {
                    window.location.replace("/api/checkpage")
                }
                if (dataSet[0].Role == 2) {
                    $("#DateManage").hide();
                    $("#manageu").hide();
                    $("#take").hide();
                    $("#import").hide();
                    $("#admin_history").hide();
                    $("#News_announce").hide();
                }
                if (dataSet[0].Role == 1 || dataSet[0].Role == 3) {
                    $("#userhistory").hide();
                }
                for (let i = 0; i < dataSet.length; i++) {
                    if (dataSet[i].Role == 2) {
                        dataSet[i].Role = "กรรมการ"
                    } else if (dataSet[i].Role == 1 || dataSet[i].Role == 3) {
                        dataSet[i].Role = "ผู้ดูแลระบบ"
                    } else {
                        dataSet[i].Role = "ผู้ดูแลถาวร"
                    }
                }
                $("#rol2").html(dataSet[0].Role)
            }).fail(function (xhr, state, error) {
                $(".alertText").html(xhr.responseText)
                $("#alertmodal").modal();
            });
        }
    }).fail(function (xhr, state, error) {
        //get data failed
        $(".alertText").html(xhr.responseText)
        $("#alertmodal").modal();
    });
});

function getItem() {
    //get users from DB
    SelectedYear = $("#Year").val();

    // click to show each item details
    $('#myTable tbody').on('click', 'td.classimg', function () {
        var data = table.row(this).data();
        var inven = data.Inventory_Number
        // console.log(table.length)
        $.ajax({
            method: "GET",
            url: "/api/item5/" + inven + '/' + SelectedYear
        }).done(function (dataSet, state, xhr) {
            // console.log(dataSet[0].Inventory_Number)
            if (dataSet[0].Image === null) {
                var PopImage = "/img/noimg.png"
            }
            else {
                PopImage = "upload/Image/" + dataSet[0].Image
            }
            if (dataSet[0].Room === "") {
                dataSet[0].Room = 'ไม่ปรากฏ'
            }
            if (dataSet[0].Location === "") {
                dataSet[0].Location = 'ไม่ระบุสถานที่'
            }
            document.getElementById('picmodal').src = PopImage;
            $(".date").html("<strong>วันที่ได้รับ : </strong> " + dataSet[0].Received_date + '<br>' + "<strong> วันที่นำเข้า :</strong> " + dataSet[0].Date_Upload)
            $("#Inventory_Number").html(dataSet[0].Inventory_Number)
            $("#des").html("<strong>คำอธิบาย :</strong> " + dataSet[0].Asset_Description)
            $("#mod").html("<strong>โมเดล : </strong> " + dataSet[0].Model + '<br>' + " <strong> ซีเรียล : </strong>" + dataSet[0].Serial + '<br>' + " <strong> สถานที่ : </strong>" + dataSet[0].Location + "-" + dataSet[0].Room)
            $("#cos").html("<strong> รหัสแผนก : </strong>" + dataSet[0].Cost_center + '<br>' + "   <strong> แผนกที่จัดเก็บ : </strong> " + dataSet[0].Department)
            $("#value").html("<strong> มูลค่า : </strong>" + dataSet[0].Original_value + " บาท" + '<br>' + "  <strong> แหล่งที่มา : </strong>" + dataSet[0].Vendor_name)
            $(".bd-example-modal-lg").modal();

        }).fail(function (xhr, state, error) {
            //get data failed
            alert(xhr.responseText);
        });
    });

    // --- getting asset data from server ---
    $.ajax({
        method: "GET",
        url: "/api/item/dashboard/showAllInfo4/" + SelectedYear
    }).done(function (dataSet, state, xhr) {
        // console.log(dataSet.length)
        if (dataSet.length == 0) {
            swal({
                title: "ไม่พบข้อมูลครุภัณฑ์",
                type: "info",
                confirmButtonClass: "btn-primary rounded",
                confirmButtonText: "ตกลง",
                closeOnConfirm: true,
            },
                // function (isConfirm) {
                //     if (isConfirm) {
                //         window.location.reload();
                //     }
                // }
            )
            // alert('aaaaaaaa')
            // console.length(dataSet.length)
        }

        // Takepicture
        for (let i = 0; i < dataSet.length; i++) {
            if (dataSet[i].Status == 0) {
                dataSet[i].Status = "สูญหาย"
            } else if (dataSet[i].Status == 1) {
                dataSet[i].Status = "ปกติ"
            } else if (dataSet[i].Status == 2) {
                dataSet[i].Status = "เสื่อมสภาพ"
            }
            if (dataSet[i].Room === "") {
                dataSet[i].Room = 'ไม่ปรากฏ'
            }
            if (dataSet[0].Location === "") {
                dataSet[0].Location = 'ไม่ระบุสถานที่'
            }
        }
        for (let i = 0; i < dataSet.length; i++) {
            if (dataSet[i].Takepicture == 0) {
                dataSet[i].Takepicture = "ไม่ต้องการรูปภาพ"
            } else if (dataSet[i].Takepicture == 1) {
                dataSet[i].Takepicture = "ต้องการรูป"
            }
            var nf = new Intl.NumberFormat();
            dataSet[i].Original_value = nf.format(dataSet[i].Original_value);
            if (dataSet[i].Image === null) {
                dataSet[i].Image = "/img/noimg.png"
            } else {
                let img = dataSet[i].Image
                dataSet[i].Image = 'upload/Image/' + img
            }
        }
        table.clear();
        table.rows.add(dataSet).draw();

        // console.log(dataSet)
        // $('#myTable td[0]').addClass("label-warning");
        $(".dt-buttons").prop('class', 'text-center  mb-2');
        $(".dt-button.buttons-excel.buttons-html5").prop('class', 'btn btn-success excel rounded mr-2 mb-2');
        $(".dt-button.buttons-print").prop('class', 'btn btn-primary print rounded mb-2');
        $(".dt-button.buttons-pdf.buttons-html5").prop('class', 'btn btn-danger pdf rounded mr-2 mb-2');


        // ========== Print Qrcode ================
        $("#qrcode").click(function () {
            var rows_selected1 = table.column(0).checkboxes.selected();
            var selectedItemQR = [];

            if (rows_selected1.length != 0) {
                $.each(rows_selected1, function (index, value) {
                    selectedItemQR.push(value);
                });
                let jsobject = JSON.stringify(selectedItemQR)
                sessionStorage.selectedItemQR = jsobject

                window.open('/api/printqrcode', '_blank');
            } else {
                swal({
                    title: "กรุณาเลือกข้อมูล",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonClass: "btn-primary rounded",
                    confirmButtonText: "ตกลง",
                    closeOnConfirm: true,
                })
            }
        });
        // ========== Print Qrcode End ================

        // ========== Print Barcode ================
        $("#barcode").click(function () {
            var rows_selected1 = table.column(0).checkboxes.selected();
            var selectedItemBR = [];

            if (rows_selected1.length != 0) {
                $.each(rows_selected1, function (index, value) {
                    selectedItemBR.push(value);
                });
                let jsobject = JSON.stringify(selectedItemBR)
                sessionStorage.selectedItemBR = jsobject
                window.open('/api/printbarcode', '_blank');
            } else {
                swal({
                    title: "กรุณาเลือกข้อมูล",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonClass: "btn-primary rounded",
                    confirmButtonText: "ตกลง",
                    closeOnConfirm: true,
                })
            }
        });
        // ========== Print Barcode End ================

        // ========== Drop Down Location ===============
        $.ajax({
            method: "GET",
            url: "/api/item/Location/" + SelectedYear
        }).done(function (data, state, xhr) {

            for (let i = data.length - 1; i >= 0; i--) {
                // let id = data[i].Location;
                if (data[i].Location === "") {
                    var id = 'ไม่ระบุสถานที่';
                }
                else {
                    id = data[i].Location;
                }
                $("#Location").append("<option value='" + id + "'>" + id + "</option>");
            }
            $('#hidelocation').hide()

            $('#Location').change(function () {
                var selected = $(this).children("option:selected").val();
                if (selected == "ไม่ระบุสถานที่") {
                    selected = ' '
                }
                // console.log(selected)
                $("#Status").val('สถานะ')
                $("#Email_Committee").val('คณะกรรมการผู้ตรวจสอบ')
                $("#Room").val('ห้อง')

                $.ajax({
                    method: "GET",
                    url: "/api/item/dashboard/showAllInfoall/" + selected + "/" + SelectedYear
                }).done(function (dataSet, state, xhr) {
                    for (let i = 0; i < dataSet.length; i++) {
                        if (dataSet[i].Status == 0) {
                            dataSet[i].Status = "สูญหาย"
                        } else if (dataSet[i].Status == 1) {
                            dataSet[i].Status = "ปกติ"
                        } else if (dataSet[i].Status == 2) {
                            dataSet[i].Status = "เสื่อมสภาพ"
                        }
                        if (dataSet[i].Room === "") {
                            dataSet[i].Room = 'ไม่ปรากฏ'
                        }
                        if (dataSet[i].Location === "") {
                            dataSet[i].Location = 'ไม่ระบุสถานที่'
                        }
                    }
                    for (let i = 0; i < dataSet.length; i++) {
                        if (dataSet[i].Takepicture == 0) {
                            dataSet[i].Takepicture = "ไม่ต้องการรูปภาพ"
                        } else if (dataSet[i].Takepicture == 1) {
                            dataSet[i].Takepicture = "ต้องการรูป"
                        }
                        var nf = new Intl.NumberFormat();
                        dataSet[i].Original_value = nf.format(dataSet[i].Original_value);
                        if (dataSet[i].Image === null) {
                            dataSet[i].Image = "/img/noimg.png"
                        } else {
                            let img = dataSet[i].Image
                            dataSet[i].Image = 'upload/Image/' + img
                        }
                    }
                    table.clear();
                    table.rows.add(dataSet).draw();
                })
            })
        })
        // ========== Drop Down Location End ================

        // ========== Drop Down Room ===============
        $.ajax({
            method: "GET",
            url: "/api/item/Room/" + SelectedYear
        }).done(function (data, state, xhr) {
            // console.log(data)

            for (let i = data.length - 1; i >= 0; i--) {
                if (data[i].Room === "") {
                    var id = 'ไม่ปรากฏ';
                }
                else {
                    id = data[i].Room;
                }
                $("#Room").append("<option value='" + id + "'>" + id + "</option>");
            }
            $('#hideroom').hide()

            $('#Room').change(function () {
                var selected = $(this).children("option:selected").val();

                if (selected == "ไม่ปรากฏ") {
                    selected = ' '
                }
                // console.log(selected)
                $("#Status").val('สถานะ')
                $("#Email_Committee").val('คณะกรรมการผู้ตรวจสอบ')
                $("#Location").val('สถานที่')

                $.ajax({
                    method: "GET",
                    url: "/api/item/dashboard/showAllInfo/" + selected + "/" + SelectedYear
                }).done(function (dataSet, state, xhr) {
                    for (let i = 0; i < dataSet.length; i++) {
                        if (dataSet[i].Status == 0) {
                            dataSet[i].Status = "สูญหาย"
                        } else if (dataSet[i].Status == 1) {
                            dataSet[i].Status = "ปกติ"
                        } else if (dataSet[i].Status == 2) {
                            dataSet[i].Status = "เสื่อมสภาพ"
                        }
                        if (dataSet[i].Room === "") {
                            dataSet[i].Room = 'ไม่ปรากฏ'
                        }
                        if (dataSet[i].Location === "") {
                            dataSet[i].Location = 'ไม่ระบุสถานที่'
                        }
                    }
                    for (let i = 0; i < dataSet.length; i++) {
                        if (dataSet[i].Takepicture == 0) {
                            dataSet[i].Takepicture = "ไม่ต้องการรูปภาพ"
                        } else if (dataSet[i].Takepicture == 1) {
                            dataSet[i].Takepicture = "ต้องการรูป"
                        }
                        var nf = new Intl.NumberFormat();
                        dataSet[i].Original_value = nf.format(dataSet[i].Original_value);
                        if (dataSet[i].Image === null) {
                            dataSet[i].Image = "/img/noimg.png"
                        } else {
                            let img = dataSet[i].Image
                            dataSet[i].Image = 'upload/Image/' + img
                        }
                    }
                    table.clear();
                    table.rows.add(dataSet).draw();
                })
            })
        })
        // ========== Drop Down Room End ================

        // ========== Drop Down Status ======================
        $.ajax({
            method: "GET",
            url: "/api/item/Status/" + SelectedYear
        }).done(function (data, state, xhr) {
            for (let i = data.length - 1; i >= 0; i--) {
                if (data[i].Status == 0) {
                    var id = "สูญหาย"
                }
                else if (data[i].Status == 1) {
                    var id = "ปกติ"
                }
                else if (data[i].Status == 2) {
                    var id = "เสื่อมสภาพ"
                }
                $("#Status").append("<option value='" + id + "'>" + id + "</option>");
            }
            $('#hidestatus').hide()
            $('#Status').change(function () {
                var selected = $(this).children("option:selected").val();
                let num
                if (selected == "เสื่อมสภาพ") {
                    num = 2
                } else if (selected == "ปกติ") {
                    num = 1
                } else if (selected == "สูญหาย") {
                    num = 0
                }
                $("#Location").val('สถานที่')
                $("#Email_Committee").val('คณะกรรมการผู้ตรวจสอบ')
                $("#Room").val('ห้อง')

                $.ajax({
                    method: "GET",
                    url: "/api/item/dashboard/showAllInfostatus/" + num + "/" + SelectedYear
                }).done(function (datastatus, state, xhr) {

                    for (let i = 0; i < datastatus.length; i++) {
                        if (datastatus[i].Status == 0) {
                            datastatus[i].Status = "สูญหาย"
                        } else if (datastatus[i].Status == 1) {
                            datastatus[i].Status = "ปกติ"
                        } else if (datastatus[i].Status == 2) {
                            datastatus[i].Status = "เสื่อมสภาพ"
                        }
                        if (datastatus[i].Room === "") {
                            datastatus[i].Room = 'ไม่ปรากฏ'
                        }
                        if (dataSet[i].Location === "") {
                            dataSet[i].Location = 'ไม่ระบุสถานที่'
                        }
                    }
                    for (let i = 0; i < datastatus.length; i++) {
                        if (datastatus[i].Takepicture == 0) {
                            datastatus[i].Takepicture = "ไม่ต้องการรูปภาพ"
                        } else if (datastatus[i].Takepicture == 1) {
                            datastatus[i].Takepicture = "ต้องการรูป"
                        }
                        var nf = new Intl.NumberFormat();
                        datastatus[i].Original_value = nf.format(datastatus[i].Original_value);

                        if (datastatus[i].Image === null) {
                            datastatus[i].Image = "/img/noimg.png"
                        } else {
                            let img = datastatus[i].Image
                            datastatus[i].Image = 'upload/Image/' + img
                            // console.log('Status Image')
                        }
                    }
                    table.clear();
                    table.rows.add(datastatus).draw();
                })
            })
        })
        // ========== Drop Down Status End ==================

        // ========== Drop Down Committee ======================
        $.ajax({
            method: "GET",
            url: "/api/item/Email_Committee/" + SelectedYear
        }).done(function (data, state, xhr) {

            for (let i = data.length - 1; i >= 0; i--) {

                let id = data[i].Email_Committee;

                $("#Email_Committee").append("<option value='" + id + "'>" + id + "</option> style='width: 100px;height: 20px;'");
            }
            $('#hidecommittee').hide()

            $('#Email_Committee').change(function () {
                var selected = $(this).children("option:selected").val();
                $("#Status").val('สถานะ')
                $("#Location").val('สถานที่')
                $("#Room").val('ห้อง')

                $.ajax({
                    method: "GET",
                    url: "/api/item/dashboard/showAllInfo3/" + selected + '/' + SelectedYear
                }).done(function (dataSet, state, xhr) {
                    for (let i = 0; i < dataSet.length; i++) {
                        if (dataSet[i].Status == 0) {
                            dataSet[i].Status = "สูญหาย"
                        } else if (dataSet[i].Status == 1) {
                            dataSet[i].Status = "ปกติ"
                        } else if (dataSet[i].Status == 2) {
                            dataSet[i].Status = "เสื่อมสภาพ"
                        } if (dataSet[i].Room === "") {
                            dataSet[i].Room = 'ไม่ปรากฏ'
                        }
                        if (dataSet[i].Location === "") {
                            dataSet[i].Location = 'ไม่ระบุสถานที่'
                        }
                    }
                    for (let i = 0; i < dataSet.length; i++) {
                        if (dataSet[i].Takepicture == 0) {
                            dataSet[i].Takepicture = "ไม่ต้องการรูปภาพ"
                        } else if (dataSet[i].Takepicture == 1) {
                            dataSet[i].Takepicture = "ต้องการรูป"
                        }
                        var nf = new Intl.NumberFormat();
                        dataSet[i].Original_value = nf.format(dataSet[i].Original_value);
                        if (dataSet[i].Image === null) {
                            dataSet[i].Image = "/img/noimg.png"
                        } else {
                            let img = dataSet[i].Image
                            dataSet[i].Image = 'upload/Image/' + img
                        }
                    }

                    table.clear();
                    table.rows.add(dataSet).draw();
                })
            })
        })
        // ========== Drop Down Committee End ==================

    });
    // --- getting server data ends ---
}   // end function getItem()