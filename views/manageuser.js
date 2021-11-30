var userURL = '/api/manageUser/showAllUser/';

$(document).ready(function () {
    // get current year from year dropdown which will be the latest year in DB
    currentYear = $("#selectYear").val();
    // render DataTables of asset items
    var table = $('#userTable').DataTable({
        responsive: true,       //for responsive column display
        deferRender: true,      //if large data, use this option
        fixedHeader: {
            header: true,
            headerOffset: 20
        },
        ajax: {
            url: userURL + currentYear,
            dataSrc: '',
        },
        columns: [
            { data: "Name", title: "ชื่อ" },
            { data: "Email_user", title: "อีเมล" },
            { data: "Email_assigner", title: "ผู้แต่งตั้ง" },
            // { data: "Role", title: "บทบาท" },
            {
                "mData": "Role",
                title: "บทบาท",
                "render": function (data) {
                    const status = ['ผู้ดูแลระบบ', 'กรรมการ', 'ผู้ดูแลระบบถาวร'];
                    return status[data-1];
                }
            }
            // {
            //     data: "Role",
            //     title: "แก้ไขหรือลบผู้ใช้",
            //     render: function (data, type, full, meta) {
            //         return data ? "<button class='btn btn-warning rounded editemail " + data + "'>แก้ไข</button> <button class='btn btn-secondary rounded deleteemail ml-1 " + data + "'>ลบ</button>" : ''
            //     }, orderable: false
            // }
        ],
    });

    $("#selectYear").change(function () {
        currentYear = $(this).val();
        // alert(currentYear);
        // reload data of the selected year
        table.ajax.url(userURL + currentYear).load();
    });

    $("#btnDuplicate").click(function () { 
        Swal.fire({
            icon: 'warning',
            title: 'คุณแน่ใจว่าจะคัดลอกผู้ใช้เดิม',
            text: 'ผู้ใช้ในปีปัจจุบันจะถูกลบออกและแทนที่ทั้งหมด',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            cancelButtonColor: '#d33',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire('Saved!', '', 'success')
            }
        });
    });
});