const currentYear = new Date().getFullYear() + 543;

$(document).ready(function () {
    // render DataTables of asset items
    table = $('#myTable').DataTable({
        // this is for custom filters
        initComplete: function () {
            let findex = 0;
            // select only columns with the specified index
            this.api().columns([7,8,18,16]).every( function () {
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
                    if(column.index() == 18) {
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
            url: '/api/item/dashboard/showAllInfo4/' + currentYear,
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
            { data: "Received_date", title: "วันที่รับทรัพย์สิน", "visible": false },//9
            { data: "Original_value", title: "Original value", "visible": false },//10
            { data: "Cost_center", title: "Cost Center", "visible": false },//11
            { data: "Department", title: "หน่วยงาน", "visible": false },//12
            { data: "Vendor_name", title: "Vendor Name1", "visible": false },//13
            { data: "Takepicture", title: "ถ่ายรูป", className: "classimg" },//14
            { data: "Date_scan", title: "วันที่ตรวจสอบ", className: "classimg" },//15
            { data: "Email_Committee", title: "ผู้ตรวจสอบ", className: "classimg" },//16
            { data: "Received_date", title: "วันที่รับสินทรัพย์", className: "classimg" },//17
            {
                "mData": "Status",
                title: "สถานะ",
                "render": function (data) {
                    const status = ['สูญหาย', 'ปกติ', 'เสื่อมสภาพ'];
                    const txtColor = ['text-danger', 'text-success', 'text-warning'];
                    return '<span class='+txtColor[data]+'>' + status[data] + '</span>';
                }
            }, //18                        
        ],
    });

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
});