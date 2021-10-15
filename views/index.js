var table;  //for DataTables
var currentYear = new Date().getFullYear() + 543;

$(document).ready(function () {
    // check whether the current year = latest asset info year        
    // convert year text to number
    const assetYear = parseInt($('#assetYear').text());
    if(currentYear > assetYear) {
        currentYear = currentYear - 1;
        // no current year assets, use the previous year instead
    }
    const url_assets = "/api/maindataTable/info/1/" + currentYear;

    // render DataTables of asset items
    table = $('#myTable').DataTable({
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
                    if(data != null) {
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
    // getItem();

    //whenever location drop-down changes
    $('#Location').change(function () {
        const loc = $(this).val();
        // console.log(loc);
        if(loc == 'all') {
            table.columns().search('').draw();
        }
        else {
            // filter the column 3 (starts with 0) by the location
            table.columns(3).search(loc).draw();  
        }
    });

    // when clicking the item to see detail
    // when clicking each asset, show more details
    $('#myTable tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        var inven = data.Inventory_Number;

        $.ajax({
            method: "GET",
            url: "/api/item5/" + inven + "/" + currentYear
        }).done(function (dataSet, state, xhr) {
            // console.log(dataSet)
            if (dataSet[0].Image === null) {
                var PopImage = "/img/noimg.png"
            }
            else {
                PopImage = "upload/Image/" + dataSet[0].Image
            }
            document.getElementById('pic').src = PopImage;
            $(".date").html("<strong>วันที่ได้รับ : </strong>" + dataSet[0].Received_date + '<br>' + "<strong> วันที่นำเข้า : </strong>" + dataSet[0].Date_Upload)
            $("#Inventory_Number").html(dataSet[0].Inventory_Number)
            $("#des").html("<strong>คำอธิบาย : </strong>" + dataSet[0].Asset_Description)
            $("#mod").html("<strong>โมเดล : </strong>" + dataSet[0].Model + '<br>' + "<strong>  ซีเรียล : </strong>" + dataSet[0].Serial + '<br>' + "<strong>  สถานที่ : </strong>" + dataSet[0].Location + "-" + dataSet[0].Room)
            $("#cos").html("<strong>รหัสแผนก : </strong>" + dataSet[0].Cost_center + '<br>' + "<strong>   แผนกที่จัดเก็บ : </strong>" + dataSet[0].Department)
            $("#value").html("<strong>   แหล่งที่มา : </strong>" + dataSet[0].Vendor_name)
            $(".bd-example-modal-lg").modal();
        }).fail(function (xhr, state, error) {
            //get data failed
            alert(xhr.responseText);
        });
    });

    // ====== Login =====
    $("#login").click(function () {
        window.location.replace("/api/auth/google");
    });
});

function getItem() {
    //get assets
    $.ajax({
        method: "GET",
        url: "/api/maindataTable/info/1/" + currentYear
    }).done(function (dataSet, state, xhr) {
        // if there is no asset in current year
        if (dataSet.length == 0) {
            // find previous year's assets
            currentYear--;
            $(".headyear").html("ข้อมูลครุภัณฑ์ประจำปี " + currentYear);
            $(".atyear").html(currentYear-1);
            $.ajax({
                method: "GET",
                url: "/api/maindataTable/info/1/" + currentYear,
                success: function (dataSet) {
                    drawTable(dataSet);
                }
            });
        } else {
            $(".headyear").html("ข้อมูลครุภัณฑ์ประจำปี " + currentYear);
            $(".atyear").html(currentYear);
            drawTable(dataSet);
        }

        // when clicking each asset, show more details
        $('#myTable tbody').on('click', 'tr', function () {
            var data = table.row(this).data();
            var inven = data.Inventory_Number;
            // $("#test").text()
            $.ajax({
                method: "GET",
                url: "/api/item5/" + inven + "/" + currentYear
            }).done(function (dataSet, state, xhr) {
                // console.log(dataSet)
                if (dataSet[0].Image === null) {
                    var PopImage = "/img/noimg.png"
                }
                else {
                    PopImage = "upload/Image/" + dataSet[0].Image
                }
                document.getElementById('pic').src = PopImage;
                $(".date").html("<strong>วันที่ได้รับ : </strong>" + dataSet[0].Received_date + '<br>' + "<strong> วันที่นำเข้า : </strong>" + dataSet[0].Date_Upload)
                $("#Inventory_Number").html(dataSet[0].Inventory_Number)
                $("#des").html("<strong>คำอธิบาย : </strong>" + dataSet[0].Asset_Description)
                $("#mod").html("<strong>โมเดล : </strong>" + dataSet[0].Model + '<br>' + "<strong>  ซีเรียล : </strong>" + dataSet[0].Serial + '<br>' + "<strong>  สถานที่ : </strong>" + dataSet[0].Location + "-" + dataSet[0].Room)
                $("#cos").html("<strong>รหัสแผนก : </strong>" + dataSet[0].Cost_center + '<br>' + "<strong>   แผนกที่จัดเก็บ : </strong>" + dataSet[0].Department)
                $("#value").html("<strong>   แหล่งที่มา : </strong>" + dataSet[0].Vendor_name)
                $(".bd-example-modal-lg").modal();

            }).fail(function (xhr, state, error) {
                //get data failed
                alert(xhr.responseText);
            });
        });
    }).fail(function (xhr, state, error) {
        //get data failed
        alert(xhr.responseText);
    });
}

function drawTable(dataSet) {
    for (let i = 0; i < dataSet.length; i++) {
        if (dataSet[i].Status == 0) {
            dataSet[i].Status = "สูญหาย"
        } else if (dataSet[i].Status == 1) {
            dataSet[i].Status = "ปกติ"
        } else if (dataSet[i].Status == 2) {
            dataSet[i].Status = "เสื่อมสภาพ"
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

    // console.log(dataSet)
    table.clear();
    //display modified JSON in DataTable
    table.rows.add(dataSet).draw();
}