var y = new Date().getFullYear() + 543;
var dateBackCheck;

$(document).ready(function () {
    $(".atyear1").html(y)

    $("#all").click(function () {
        window.location.replace("/information");
    });

    $.ajax({
        method: "GET",
        url: "/api/item/dashboard/showuser"
    }).done(function (data, state, xhr) {
        let status = 0
        for (let i = 0; i < data.length; i++) {
            if (data[i].Status == 1 || data[i].Status == 2) {
                status++;
            }
        }
        if (status > 0) {
            $("#addtime").hide();
            document.getElementById("date_start_update").disabled = true;
        }
    })

    $.ajax({
        method: "GET",
        url: "/api/profile/infouser"
    }).done(function (data, state, xhr) {
        $("#user").html(data.name);
        document.getElementById('pic').src = data.photo;
        if (data.email === undefined) {
            window.location.replace("/checkpage")
        } else {
            $.ajax({
                method: "GET",
                url: "/api/manageUser/showAllUsers/" + data.email
            }).done(function (dataSet, state, xhr) {
                if (dataSet[0] === undefined || dataSet[0].data === 0) {
                    window.location.replace("/checkpage")
                }
                if (dataSet[0].Role == 2) {
                    $("#manageu").hide();
                    $("#addtime").hide();
                    $("#edittime").hide();
                }
                if (dataSet[0].Role == 1 || dataSet[0].Role == 3) {
                    $("#userhistory").hide();
                }
                for (let i = 0; i < dataSet.length; i++) {
                    if (dataSet[i].Role == 2) {
                        dataSet[i].Role = "กรรมการ"
                    } else if (dataSet[i].Role == 1) {
                        dataSet[i].Role = "ผู้ดูแลระบบ"
                    } else {
                        dataSet[i].Role = "ผู้ดูแลถาวร"
                    }
                }
                $("#rol2").html(dataSet[0].Role)

            }).fail(function (xhr, state, error) {
                //get data failed
                $(".alertText").html(xhr.responseText)
                $("#alertmodal").modal();

            });
        }
    }).fail(function (xhr, state, error) {
        //get data failed
        $(".alertText").html(xhr.responseText)
        $("#alertmodal").modal();
    });
    var yyyy = new Date().getFullYear() + 543

    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd',
        todayBtn: true,
        language: 'th',             //เปลี่ยน label ต่างของ ปฏิทิน ให้เป็น ภาษาไทย   (ต้องใช้ไฟล์ bootstrap-datepicker.th.min.js นี้ด้วย)
        thaiyear: true,              //Set เป็นปี พ.ศ.
        todayHighlight: true,
        autoclose: true,
        startDate: new Date(new Date().getFullYear() + '-01-01'),
        endDate: new Date(new Date().getFullYear() + '-12-31')
    }).datepicker("setDate", "10");  //กำหนดเป็นวันปัจุบัน

    $.ajax({
        method: "GET",
        url: "/api/dateTime/showDateTime"
    }).done(function (data, state, xhr) {
        console.log(data)

        if (data == 0) {
            $("#edittime").hide();
        } else {
            $('#textDateStart').text(data[0].Date_start)
            $('#textDateEnd').text(data[0].Date_end)

            $.ajax({
                method: "GET",
                url: "/api/datescan/user"
            }).done(function (dataSet, state, xhr) {
                if (dataSet != dataSet.length) {
                    dateBackCheck = dataSet[dataSet.length - 1].Date_Scan
                }
                $.ajax({
                    method: "GET",
                    url: "/api/user/datescan"
                }).done(function (datas, state, xhr) {
                    var date = 0
                    var event = []
                    var more = 0

                    $.ajax({
                        method: "GET",
                        url: "/api/numberitem"
                    }).done(function (dataitem, state, xhr) {

                        for (let i = 0; i < dataSet.length; i++) {
                            for (let j = 0; j < datas.length; j++) {
                                if (dataSet[i].Date_Scan == datas[j].Date_Scan) {
                                    date++;
                                }
                            }
                            let d = moment(dataSet[i].Date_Scan)
                            let day = d.add(-543, 'years').format("YYYY-MM-DD")


                            event.push(
                                {
                                    title: 'ตรวจแล้ว ' + date + "/ " + dataitem[0].numofitem,
                                    start: day,
                                    end: day,
                                    color: 'green'
                                }
                            )
                        }
                        var number = dataitem[0].numofitem
                        if (dataitem[0].numofitem == 0) {

                            more = 0;
                        } else {
                            more = number - date
                        }
                        $(".scan").html("ตรวจสอบแล้ว : " + date + " ชิ้น")
                        $(".count").html("คงเหลือ  : " + more + " ชิ้น")
                        $(".totalall").html("ครุภัณฑ์ทั้งหมด  : " + number + " ชิ้น")
                        let d1 = moment(data[0].Date_start)
                        let day1 = d1.add(-543, 'years').format("YYYY-MM-DD")
                        let d2 = moment(data[0].Date_end)
                        let day2 = d2.add(-543, 'years').format("YYYY-MM-DD")
                        event.push(
                            {
                                title: 'ช่วงเวลาการตรวจสอบครุภัณฑ์ ประจำปี ' + data[0].Years,
                                start: day1,
                                end: day2
                            }
                        )

                        $('#calendar1').fullCalendar({
                            header: {
                                left: 'prev,next today',
                                center: 'title',
                                right: 'month,agendaWeek,agendaDay,listWeek'
                            },
                            navLinks: true, // can click day/week names to navigate views
                            editable: true,
                            eventLimit: true, // allow "more" link when too many events
                            events: event,
                            lang: 'th',
                            dayClick: function () {
                            }
                        });
                        $('.fc-content').addClass('text-center')
                    })
                })
            })
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear() + 543;

            today = yyyy + '-' + mm + '-' + dd;

            if (today > data[0].Date_start) {

                document.getElementById("date_start_update").disabled = true;
            }
            if (!data[0]) {

            } else {
                $("#addtime").hide();
            }
        }
    }).fail(function (xhr, state, error) {
        //get data failed
        $("#edittime").hide();
        $(".alertText").html(xhr.responseText)
        $("#alertmodal").modal();
    });

    $('#edittime').click(function () {
        $("#date_start_update").val($('#textDateStart').text())
        $("#date_end_update").val($('#textDateEnd').text())
    })

    // Click for update date in database
    $("#bt_UpdateDate").click(function () {

        let date_start_update = $("#date_start_update").val()
        let date_end_update = $("#date_end_update").val()
        console.log(date_start_update)
        console.log(date_end_update)
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear() + 543;

        today = yyyy + '-' + mm + '-' + dd;

        if (!date_start_update || date_start_update.length === 0 || !date_end_update || date_end_update.length === 0) {

            swal({
                title: "กรุณาใส่วันที่เริ่มต้น หรือ วันที่สิ้นสุด",
                text: '<br> ',
                type: "info",
                confirmButtonClass: "btn-primary rounded",
                confirmButtonText: "ตกลง",
                closeOnConfirm: true,
                html: true,
            })
        } else if (date_start_update >= date_end_update) {

            swal({
                title: "กรุณากรอกวันที่ให้ถูกต้อง",
                text: '<br> ',
                type: "info",
                confirmButtonClass: "btn-primary rounded",
                confirmButtonText: "ตกลง",
                closeOnConfirm: true,
                html: true,
            })
        } else if (dateBackCheck >= date_end_update) {
            swal({
                title: "กรุณากรอกวันที่ให้ถูกต้อง",
                text: '<br> ',
                type: "info",
                confirmButtonClass: "btn-primary rounded",
                confirmButtonText: "ตกลง",
                closeOnConfirm: true,
                html: true,
            })
        }
        else {
            $.ajax({
                method: "PUT",
                url: "/api/dateTime/updateTime/" + date_start_update + "/" + date_end_update
            }).done(function (data, state, xhr) {

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
            }).fail(function (xhr, state, error) {
                //get data failed
                $(".alertText").html(xhr.responseText)
                $("#alertmodal").modal();

            });
        }
    });
    // ฟิค years ไว้ใน database ทำให้ไม่สามารถใส่ปีซ้ำได้
    $("#bt_AddNewDate").click(function () {
        let date_start_add = $("input[name=Date_start_add]").val();
        let date_end_add = $("input[name=Date_end_add]").val();
        // alert(date_start_add)
        if (!date_start_add || date_start_add.length === 0 || !date_end_add || date_end_add.length === 0) {
            swal({
                title: "กรุณาใส่วันที่เริ่มต้น หรือ วันที่สิ้นสุด",
                text: '<br> ',
                type: "info",
                confirmButtonClass: "btn-primary rounded",
                confirmButtonText: "ตกลง",
                closeOnConfirm: true,
                html: true,
            })
        } else if (date_start_add >= date_end_add) {
            swal({
                title: "กรุณากรอกวันที่ให้ถูกต้อง",
                text: '<br> ',
                type: "info",
                confirmButtonClass: "btn-primary rounded",
                confirmButtonText: "ตกลง",
                closeOnConfirm: true,
                html: true,
            })
        } else {
            $.ajax({
                method: "POST",
                url: "/api/dateTime/insertTime/" + date_start_add + "/" + date_end_add
            }).done(function (data, state, xhr) {
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

            }).fail(function (xhr, state, error) {
                //get data failed
                $(".alertText").html(xhr.responseText)
                $("#alertmodal").modal();

            });
        }


    });
});