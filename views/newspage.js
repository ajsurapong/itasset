var table
var fileName
var EmailOwner //เมลคนประกาศ
var number
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear() + 543;

today = yyyy + '-' + mm + '-' + dd;
$(document).ready(function () {
    $(".atyear1").html(yyyy)
    $("#all").click(function () {
        window.location.replace("/api/dashboard");
    });
    getItem();

    table = $('#myTable').DataTable({
        "columnDefs": [
            { "width": "10%", "targets": 4 },
            { "width": "10%", "targets": 5 }
        ],
        deferRender: true,
        columns: [

            { data: "No", title: "ลำดับ", visible: false },
            { data: "Number", visible: false },
            { data: 'Head', title: "หัวข้อ" },
            { data: "Detail", title: "รายละเอียด" },
            { data: "DateEndCreate", title: "วันที่เริ่มประกาศข่าว" },
            { data: "Status", title: "ลักษณะข่าว" },
            { data: "Email_announcer", title: "ผู้กำหนดประกาศ" },
            {
                data: "No",
                render: function (data, type, full, meta) {
                    return data ? '<button class="btn btn-warning rounded edit" id="edit' + full.No + '">แก้ไข</button> <button class="btn btn-secondary rounded delete" id=delete"' + full.No + '">ลบ</button>' : '';
                }, title: "แก้ไขข่าวหรือลบ", orderable: false
            },
        ],
        responsive: true,
    });

    Loadannounce();

    // /*  ==========================================
    //     SHOW UPLOADED IMAGE NAME
    // * ========================================== */

});

// Function crate table ===========================
//=================================================

function Loadannounce() {
    $.ajax({
        method: "GET",
        url: "/api/Loadannounce",
    }).done(function (dataSet, state, xhr) {
        if (dataSet.length == 0) {
            swal({
                title: "ไม่พบข่าวประชาสัมพันธ์",
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
        for (let i = 0; i < dataSet.length; i++) {
            dataSet[i].No = i + 1;

            if (dataSet[i].Status == 1) {
                dataSet[i].Status = "ประชุม"
            } else if (dataSet[i].Status == 2) {
                dataSet[i].Status = "ทั่วไป"
            }
        }
        //clear DataTable
        table.clear();
        //display modified JSON in DataTable
        table.rows.add(dataSet).draw();

        // add announce ===========================================
        // ========================================================

        $('#AddAnnounce').click(function (e) { //ปุ่มสร้างข่าว
            $("#Head").val('');
            $("#Detail").val('');
            $("#Date").val('');
            $("#upload-label").text('เลือกรูป')
            $("#exampleModalLabel").text('สร้างข่าวประชาสัมพันธ์')
            $("#ModalAnnounceAdd").modal('toggle');
            $("#btnAdd").show();
            $("#btnEdit").hide();

        });

        $('#btnAdd').click(function (e) {
            var head = $("#Head").val();
            var detail = $("#Detail").val();
            var Date1 = today;
            var status = $("input[name='AnnounceStatus']:checked").val();

            if (head == '' || detail == '' || Date1 == '') {

                swal({
                    title: "กรุณากรอกข้อมูลให้ครบถ้วน",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonClass: "btn-primary rounded",
                    confirmButtonText: "ตกลง",
                    closeOnConfirm: true,
                })
            }
            else {
                $.ajax({
                    method: "POST",
                    url: "/api/AddAnnounce/" + EmailOwner,
                    data: { Head: head, Detail: detail, DateEndCreate: Date1, Status: status },
                }).done(function (dataSet, state, xhr) {
                    swal({
                        title: "<small>บันทึกสำเร็จ</small>",
                        type: "success",
                        confirmButtonClass: "btn-success rounded",
                        confirmButtonText: "ยืนยัน",
                        closeOnConfirm: true,
                        closeOnCancel: true,
                        html: true
                    },
                        function (isConfirm) {
                            if (isConfirm) {
                                window.location.reload()
                                $("#ModalAnnounceAdd").modal('toggle')
                            }
                        });
                }).fail(function (xhr, state, error) {
                    alert("fail1")
                })
            }
        });

        // end add announde ===========================================
        // ========================================================

        // edit announce ===========================================
        // ========================================================
        $('#myTable tbody').on('click', '.edit', function () {
            const currentRow = $(this).parents('tr')
            selectedData = table.row(currentRow).data();
            number = selectedData.Number
            $("#btnAdd").hide();
            $("#btnEdit").show();
            $("#exampleModalLabel").text('แก้ไขข่าวประชาสัมพันธ์')
            $("#Head").val(selectedData.Head);
            $("#Detail").val(selectedData.Detail);
            $("#Date").val(selectedData.DateEndCreate);
            if (selectedData.Status == 'ประชุม') {
                $('input:radio[name=AnnounceStatus][value=1]').prop('checked', true)
            }
            else {
                $('input:radio[name=AnnounceStatus][value=2]').prop('checked', true)
            }

            $("#ModalAnnounceAdd").modal('toggle');

            $('#btnEdit').click(function (e) {

                var head = $("#Head").val();
                var detail = $("#Detail").val();
                var Date1 = today;
                var status = $("input[name='AnnounceStatus']:checked").val();

                if (head == '' || detail == '' || Date1 == '') {

                    swal({
                        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
                        type: "info",
                        showCancelButton: false,
                        confirmButtonClass: "btn-primary rounded",
                        confirmButtonText: "ตกลง",
                        closeOnConfirm: true,
                    })
                }
                else {
                    $.ajax({
                        type: "PUT",
                        url: "/api/EditAnnounce/" + EmailOwner + "/" + number,
                        data: { Head: head, Detail: detail, DateEndCreate: Date1, Status: status },
                    }).done(function (dataSet, state, xhr) {
                        swal({
                            title: "<small>บันทึกสำเร็จ</small>",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonClass: "btn-success rounded",
                            confirmButtonText: "ยืนยัน",
                            closeOnConfirm: true,
                            html: true
                        },
                            function (isConfirm) {
                                if (isConfirm) {
                                    $("#ModalAnnounceAdd").modal('toggle')
                                    Loadannounce()
                                    window.location.reload()
                                }
                            });
                    }).fail(function (xhr, state, error) {

                    })
                }

            });

        });
        // end edit announce ===========================================
        // =============================================================

        // update announce ===========================================
        // ========================================================
        $('#myTable tbody').on('click', '.delete', function () {
            const currentRow = $(this).parents('tr')
            selectedData = table.row(currentRow).data();
            number = selectedData.Number

            swal({
                title: "ยืนยันจะลบข้อมูลหรือไหม",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger rounded",
                cancelButtonClass: "btn-primary rounded",
                confirmButtonText: "ยืนยัน",
                cancelButtonText: "ยกเลิก",
                closeOnConfirm: false,
                closeOnCancel: true
            },
                function (isConfirm) {
                    if (isConfirm) {
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
                                    $.ajax({
                                        method: "delete",
                                        url: "/api/DeleteAnnounce/" + number,
                                    }).done(function (dataSet, state, xhr) {
                                        window.location.reload()
                                    }).fail(function (xhr, state, err) {

                                    })
                                }
                            });
                    }
                });
        })

        // end update announce ===========================================
        // ========================================================

    }).fail(function (xhr, state, error) {

    })
}

// Function crate table End =======================
//=================================================

function getItem() {
    $.ajax({
        method: "GET",
        url: "/api/profile/infouser"
    }).done(function (data, state, xhr) {
        $(".user").html(data.name);
        EmailOwner = data.email;
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
                    $("#managUser").hide();
                    $("#manageu").hide();
                }
                if (dataSet[0].Role == 1 || dataSet[0].Role == 3) {
                    $("#userhistory").hide();

                }
                for (let i = 0; i < dataSet.length; i++) {
                    if (dataSet[i].role == 2) {
                        dataSet[i].role = "กรรมการ"
                    } else if (dataSet[i].role == 1) {
                        dataSet[i].role = "ผู้ดูแลระบบ"
                    } else {
                        dataSet[i].Role = "ผู้ดูแลถาวร"
                    }
                }
                $("#rol2").html(dataSet[0].role)

            }).fail(function (xhr, state, error) {
                //get data failed
                $(".alertText").html(xhr.responseText)
                $("#alertmodal").modal();
            });
        }

        ///////////////////////////เพิ่มชื่อ ในดาต้าเบส ////////////////////////////
        $.ajax({
            method: "PUT",
            url: "/api/manageUser/updatename/" + data.name + "/" + data.email
        }).done(function (data, state, xhr) {


        }).fail(function (xhr, state, error) {
            //get data failed
        });
    }).fail(function (xhr, state, error) {
        //get data failed
        $(".alertText").html(xhr.responseText)
        $("#alertmodal").modal();
    });
}