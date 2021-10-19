var table;  //for DataTables

$(document).ready(function () {
    const currentYear = $("#assetYear").text();
    const url_assets = "/api/maindataTable/info/1/" + currentYear;

    // render DataTables of asset items
    table = $('#myTable').DataTable({
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
        fixedHeader: true,      //for fixed header
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

    // when clicking the item to see detail
    // when clicking each asset, show more details
    // $('#myTable tbody').on('click', 'tr', function () {
    //     var data = table.row(this).data();
    //     var inven = data.Inventory_Number;

    //     $.ajax({
    //         method: "GET",
    //         url: "/api/item5/" + inven + "/" + currentYear
    //     }).done(function (dataSet, state, xhr) {
    //         // console.log(dataSet)
    //         if (dataSet[0].Image === null) {
    //             var PopImage = "/img/noimg.png"
    //         }
    //         else {
    //             PopImage = "upload/Image/" + dataSet[0].Image
    //         }
    //         document.getElementById('pic').src = PopImage;
    //         $(".date").html("<strong>วันที่ได้รับ : </strong>" + dataSet[0].Received_date + '<br>' + "<strong> วันที่นำเข้า : </strong>" + dataSet[0].Date_Upload)
    //         $("#Inventory_Number").html(dataSet[0].Inventory_Number)
    //         $("#des").html("<strong>คำอธิบาย : </strong>" + dataSet[0].Asset_Description)
    //         $("#mod").html("<strong>โมเดล : </strong>" + dataSet[0].Model + '<br>' + "<strong>  ซีเรียล : </strong>" + dataSet[0].Serial + '<br>' + "<strong>  สถานที่ : </strong>" + dataSet[0].Location + "-" + dataSet[0].Room)
    //         $("#cos").html("<strong>รหัสแผนก : </strong>" + dataSet[0].Cost_center + '<br>' + "<strong>   แผนกที่จัดเก็บ : </strong>" + dataSet[0].Department)
    //         $("#value").html("<strong>   แหล่งที่มา : </strong>" + dataSet[0].Vendor_name)
    //         $(".bd-example-modal-lg").modal();
    //     }).fail(function (xhr, state, error) {
    //         //get data failed
    //         alert(xhr.responseText);
    //     });
    // });

    // ====== Login =====
    $("#login").click(function () {
        // window.location.replace("/api/auth/google");
        $("#modalLogin").modal();
    });

    $("#btnLogin").click(function () {
        const username = $("#txtUsername").val().trim();
        const password = $("#txtPassword").val().trim();
        if (username.length == 0 || password.length == 0) {
            swal({
                title: "กรุณาป้อนข้อมูลให้ครบถ้วน",
                type: "warning",
                showCancelButton: false,
                confirmButtonClass: "btn-primary rounded",
                confirmButtonText: "ตกลง",
                closeOnConfirm: true,
            });
            return;
        }

        $.ajax({
            type: "POST",
            url: "/api/auth/signin",
            data: { username: username, password: password },
            success: function (response) {
                $("#modalLogin").modal("hide");
                // alert(response);
                window.location.replace(response);
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                swal({
                    title: "ไม่สามารถเข้าสู่ระบบได้ \n โปรดตรวจสอบข้อมูล",
                    type: "error",
                    showCancelButton: false,
                    confirmButtonClass: "btn-primary rounded",
                    confirmButtonText: "ตกลง",
                    closeOnConfirm: true,
                });
            }
        });
    })
});