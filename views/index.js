var table;  //for DataTables

$(document).ready(function () {
    const currentYear = $("#year").text();
    const url_assets = "/api/maindataTable/info/1/" + currentYear;

    // render DataTables of asset items
    table = $('#assetTable').DataTable({
        // this is for custom filters
        initComplete: function () {
            // select only columns with the specified index
            this.api().columns([3]).every(function () {
                var column = this;
                $('<span class="ml-4 mr-2">สถานที่</span>').appendTo("#customFilter");
                var select = $('<select><option value="">ทั้งหมด</option></select>')
                    .appendTo('#customFilter')
                    .on('change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );

                        column
                            .search(val ? '^' + val + '$' : '', true, false)
                            .draw();
                    });

                column.data().unique().sort().each(function (value, index) {
                    select.append('<option value="' + value + '">' + value + '</option>');
                });
            });
        },
        responsive: true,       //for responsive column display
        deferRender: true,      //if large data, use this option
        fixedHeader: {
            header: true,
            headerOffset: 20
        },
        ajax: {
            url: url_assets,
            dataSrc: '',
        },
        columns: [
            {
                "mData": "Image", title: "รูปภาพ",
                "render": function (data) {
                    let img = '/img/noimg.png';
                    if (data != null) {
                        img = 'upload/Image/' + data;
                    }
                    return '<img class="pic" src="' + img + '"style="width: 100px;margin: 25px;-webkit-transition: all .4s ease-in-out;-moz-transition: all .4s ease-in-out;-o-transition: all .4s ease-in-out; -ms-transition: all .4s ease-in-out; "  />';
                }
            },
            { data: "Inventory_Number", title: "รหัสครุภัณฑ์" },
            { data: "Asset_Description", title: "ชื่อครุภัณฑ์" },
            { data: "Location", title: "สถานที่" },
            { data: "Room", title: "ห้อง" },
            { data: "Department", title: "แผนกที่ดูแล" },
            { data: "Date_scan", title: "วันที่ตรวจสอบ" },
            // { data: "Email_Committee", title: "ผู้ตรวจสอบ" },
            // { data: "Status", title: "สถานะ" },
            {
                "mData": "Status",
                title: "สถานะ",
                "render": function (data) {
                    const status = ['สูญหาย', 'ปกติ', 'เสื่อมสภาพ'];
                    return status[data];
                }
            }
        ],
    });

    // ====== Login =====
    $("#btnLogin").click(function () {
        // validate inputs
        const username = $("#txtUsername").val().trim();
        const password = $("#txtPassword").val().trim();
        if (username.length == 0 || password.length == 0) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณาป้อนข้อมูลให้ครบถ้วน',
            });
            return;
        }

        // inputs are complete, authen them
        $.ajax({
            type: "POST",
            url: "/api/auth/signin",
            data: { username: username, password: password },
            success: function (response) {
                $("#modalLogin").modal("hide");
                // forward to main page
                window.location.replace(response);
            },
            error: function (xhr) {
                // console.error(xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถเข้าสู่ระบบได้ \n โปรดตรวจสอบข้อมูล',
                });
            }
        });
    });
});