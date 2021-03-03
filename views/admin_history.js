var table;
var today = new Date();
var yyyy = today.getFullYear() + 543;
var selectedYear;

$(document).ready(function () {

    $(".atyear1").html(yyyy)
    //====================================== drop down Year ======================================
    $.ajax({
        method: "GET",
        url: "/api/adminhistorytableEmailCommittee/year"
    }).done(function (data, state, xhr) {
        /////////////////////ข้อมูลผู้แสกนในตาราง //////////////////////////////////
        $.ajax({
            method: "GET",
            url: "/api/adminhistorytableEmailCommittee/infoshow"
            // / adminhistorytableEmailCommittee / info /
        }).done(function (datakeep, state, xhr) {
            if (datakeep.length == 0) {
                swal({
                    title: "ไม่พบข้อมูลการตรวจนับ",
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
            // let datatotable = []
            // for (let i = 0; i < datakeep.length; i++) {
            //     $.ajax({
            //         method: "GET",
            //         url: "/api/adminhistorytable/info/" + datakeep[i].Email_Committee + "/" + selectedYear
            //     }).done(function (datae, state, xhr) {
            //         $.ajax({
            //             method: "GET",
            //             url: "/api/EmailCommitteename/info/" + datakeep[i].Email_Committee
            //         }).done(function (datat, state, xhr) {
            //             datatotable.push(
            //                 {
            //                     Name: datat[0].Email_user,
            //                     num: datae[0].num
            //                 }
            //             )
            //             table.clear();
            //             table.rows.add(datatotable).draw();

            //         })
            //     })
            // }

            $.ajax({
                method: "GET",
                url: "/api/committee/checkedItems/" + selectedYear,
                // / adminhistorytableEmailCommittee / info /
            }).done(function (datacheck, state, xhr) {
                table.clear();
                table.rows.add(datacheck).draw();
            }).fail(function (xhr, state, error) {
                console.log(error);
            });
        });

        var values = [];
        let countyear = 0
        if (data.length > 5) {
            countyear = 5
        } else {
            countyear = data.length
        }
        for (let i = 0; i < countyear; i++) {
            values[i] = [data[i].Year]
        }
        // values[data.length] = 'ปี'
        $('.btnGroupDrop1')
            .append(
                $(document.createElement('select')).prop({
                    style: 'border-color: white',
                    class: 'mt-3 ml-3 Year',
                    id: 'Year',
                    name: 'Year'
                })
            )

        //drop down status Year
        for (let i = values.length - 1; i >= 0; i--) {
            $('#Year').append($(document.createElement('option')).prop({
                value: values[i],
                text: values[i],
                class: values[i]
            }))
        }
        $('.ปี').hide()
        selectedYear = $("#Year").val()

        $('select.Year').change(function () {
            var selected = $(this).children("option:selected").val();
            /////////////////////ข้อมูลผู้แสกนในตาราง //////////////////////////////////
            $.ajax({
                method: "GET",
                url: "/api/adminhistorytableEmailCommittee/info/" + selected
            }).done(function (datakeep, state, xhr) {
                // let datatotable = []
                // for (let i = 0; i < datakeep.length; i++) {
                //     $.ajax({
                //         method: "GET",
                //         url: "/api/adminhistorytable/info/" + datakeep[i].Email_Committee + "/" + selected
                //     }).done(function (datae, state, xhr) {

                //         $.ajax({
                //             method: "GET",
                //             url: "/api/EmailCommitteename/info/" + datakeep[i].Email_Committee
                //         }).done(function (datat, state, xhr) {
                //             datatotable.push(
                //                 {
                //                     Name: datat[0].Name,
                //                     num: datae[0].num
                //                 }
                //             )
                //             table.clear();
                //             table.rows.add(datatotable).draw();

                //         })
                //     })
                // }

                $.ajax({
                    method: "GET",
                    url: "/api/committee/checkedItems/" + selected,
                    // / adminhistorytableEmailCommittee / info /
                }).done(function (datacheck, state, xhr) {
                    table.clear();
                    table.rows.add(datacheck).draw();
                }).fail(function (xhr, state, error) {
                    console.log(error);
                });
            });
        });

    })

    //========================================== Table =============================================
    table = $('#myTable').DataTable({
        columns: [
            { data: "Email_Committee", title: "ผู้ตรวจนับ" },
            { data: "num", title: "จำนวนที่ตรวจนับ" }
        ],
    });

    $.ajax({
        method: "GET",
        url: "/api/profile/infouser"
    }).done(function (data, state, xhr) {
        $(".user").html(data.name);
        document.getElementById('pic').src = data.photo;
        document.getElementById('pic1').src = data.photo;
        $("#name").html(data.name);
        $("#mail").html(data.email);
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

                $("#rol").html(dataSet[0].Role)
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

});