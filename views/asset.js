// let currentYear = new Date().getFullYear() + 543;
var currentYear;
var assetURL = '/api/item/dashboard/showAllInfo4/';

$(document).ready(function () {
    // get current year from year dropdown which will be the latest year in DB
    currentYear = $("#selectYear").val();
    // render DataTables of asset items
    var table = $('#myTable').DataTable({
        // this is for custom filters
        initComplete: function () {
            let findex = 0;
            // select only columns with the specified index
            this.api().columns([7,8,17,16]).every( function () {
                var column = this;
                let filterName = ['สถานที่','ห้อง','สถานะ','ผู้ตรวจสอบ'];
                $('<span class="ml-4 mr-2">'+filterName[findex]+'</span>').appendTo("#customFilter");
                findex++;           
                var select = $('<select><option value="">ทั้งหมด</option></select>')
                    .appendTo('#customFilter')
                    .on('change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
 
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
 
                column.data().unique().sort().each( function ( value, index ) {
                    let txt = 'ไม่ระบุ';
                    if(column.index() == 17) {
                        if(value == 0) {
                            txt = 'สูญหาย';
                        }
                        else if(value == 1) {
                            txt = 'ปกติ';
                        }
                        select.append( '<option value="'+txt+'">'+txt+'</option>' );
                    }
                    else {
                        select.append( '<option value="'+value+'">'+value+'</option>' );
                    }                    
                } );
            } );
        },
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
        responsive: true,       //for responsive column display
        deferRender: true,      //if large data, use this option
        fixedHeader: true,      //for fixed header
        ajax: {
            url: assetURL + currentYear,
            dataSrc: '',
        },
        columns: [
            { data: "Inventory_Number" },//0
            { data: "Asset_Number", title: "Asset_Number", "visible": false },//1
            {
                "mData": "Image", title: "รูปภาพ",
                "render": function (data) {
                    let img = '/img/noimg.png';
                    if(data != null) {
                        img = 'upload/Image/' + data;
                    }
                    return '<img class="pic" src="' + img + '" style="width: 100px;margin: 25px;-webkit-transition: all .4s ease-in-out;-moz-transition: all .4s ease-in-out;-o-transition: all .4s ease-in-out; -ms-transition: all .4s ease-in-out; "  />';
                }
                , className: "classimg",
            }, //2
            { data: "Inventory_Number", title: "รหัสครุภัณฑ์", className: "classimg" },//3
            { data: "Asset_Description", title: "ชื่อครุภัณฑ์", className: "classimg" },//4
            { data: "Model", title: "ยี่ห้อ/รุ่น", "visible": false },//5
            { data: "Serial", title: "Serial number", "visible": false },//6
            { data: "Location", title: "สถานที่", className: "classimg" },//7
            { data: "Room", title: "ห้อง", className: "classimg" },//8
            { data: "Received_date", title: "วันที่รับทรัพย์สิน", className: "classimg"},//9
            { data: "Original_value", title: "Original value", "visible": false },//10
            { data: "Cost_center", title: "Cost Center", "visible": false },//11
            { data: "Department", title: "หน่วยงาน", "visible": false },//12
            { data: "Vendor_name", title: "Vendor Name1", "visible": false },//13
            // { data: "Takepicture", title: "ถ่ายรูป", className: "classimg" },//14
            {
                "mData": "Takepicture",
                title: "ถ่ายรูป",
                "render": function (data) {
                    const status = ['ไม่บังคับ', 'บังคับ'];
                    return status[data];
                }
            },//14
            { data: "Date_scan", title: "วันที่ตรวจสอบ", className: "classimg" },//15
            { data: "Email_Committee", title: "ผู้ตรวจสอบ", className: "classimg" },//16
            {
                "mData": "Status",
                title: "สถานะ",
                "render": function (data) {
                    const status = ['สูญหาย', 'ปกติ', 'เสื่อมสภาพ'];
                    const txtColor = ['text-danger', 'text-success', 'text-warning'];
                    return '<span class='+txtColor[data]+'>' + status[data] + '</span>';
                }
            }, //17                        
        ],
    });

    // ========== Export to Excel and PDF ================
    //===== เปลี่ยน font PDF ====
    pdfMake.fonts = {
        THSarabun: {
            normal: 'THSarabun.ttf',
            bold: 'THSarabun-Bold.ttf',
            italics: 'THSarabun-Italic.ttf',
            bolditalics: 'THSarabun-BoldItalic.ttf'
        }
    }

    // create export buttons and append to export modal
    new $.fn.dataTable.Buttons(table, {
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

    // ========== Print Qrcode ================
    $("#selectQR").click(function () {
        let rows_selected = table.column(0).checkboxes.selected();
        // the result is an Object that we need to loop to get its values
        let selectedItemQR = [];

        // check if any item is selected
        if (rows_selected.length != 0) {
            $.each(rows_selected, function (index, value) {
                selectedItemQR.push(value);
            });
            // convert array to JSON string and save to sessionStorage
            let jsobject = JSON.stringify(selectedItemQR)
            sessionStorage.selectedItemQR = jsobject
            // Jump to QR code printing page
            window.open('/api/printqrcode', '_blank');
        } else {
            // no item selected
            swal({
                title: "กรุณาเลือกข้อมูล",
                type: "info",
                showCancelButton: false,
                confirmButtonClass: "btn-primary rounded",
                confirmButtonText: "ตกลง",
                closeOnConfirm: true,
            });
        }
    });

    // ========== Print Barcode ================
    $("#selectBar").click(function () {
        swal({
            title: "รายการนี้อยู่ระหว่างการพัฒนา",
            type: "error",
            showCancelButton: false,
            confirmButtonClass: "btn-primary rounded",
            confirmButtonText: "ตกลง",
            closeOnConfirm: true,
        });
        // var rows_selected = table.column(0).checkboxes.selected();
        // var selectedItemBR = [];

        // if (rows_selected.slength != 0) {
        //     $.each(rows_selected, function (index, value) {
        //         selectedItemBR.push(value);
        //     });
        //     let jsobject = JSON.stringify(selectedItemBR);
        //     sessionStorage.selectedItemBR = jsobject;
        //     window.open('/api/printbarcode', '_blank');
        // } else {
        //     swal({
        //         title: "กรุณาเลือกข้อมูล",
        //         type: "info",
        //         showCancelButton: false,
        //         confirmButtonClass: "btn-primary rounded",
        //         confirmButtonText: "ตกลง",
        //         closeOnConfirm: true,
        //     });
        // }
    });

    // ========== Import Excel file ================
    $("#formImport").submit(function (e) {
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
        else if (fileExtension != "xlsx" || fileExtension != "xls") {
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

    // ========== Change year to get new asset data ================
    $("#selectYear").change(function () { 
        currentYear = $(this).val();
        // alert(currentYear);
        // reload data of the selected year
        table.ajax.url(assetURL + currentYear).load();
    });
});