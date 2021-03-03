var table;
var Email_user;
var rol;
var pattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
var selected
var EmailOfUser
$(document).ready(function () {
    $(".atyear1").html(new Date().getFullYear() + 543)

    table = $('#myTable').DataTable({
        columns: [
            { data: "Name", title: "ชื่อผู้ใช้" },
            { data: "Email_user", title: "อีเมลผู้ใช้" },
            { data: "Email_assigner", title: "ผู้แต่งตั้ง" },
            { data: "Role", title: "หน้าที่" },
            {
                data: "Role",
                title: "แก้ไขหรือลบผู้ใช้",
                render: function (data, type, full, meta) {
                    return data ? "<button class='btn btn-warning rounded editemail " + data + "'>แก้ไข</button> <button class='btn btn-secondary rounded deleteemail ml-1 " + data + "'>ลบ</button>" : ''
                }, orderable: false

            }
        ],
    });

    $.ajax({
        method: "GET",
        url: "/api/year/user"
    }).done(function (data, state, xhr) {

        var values = [];
        selected = $('#Year').val();

        $('.Year').append($(document.createElement('select')).prop({

            class: 'year',
            name: 'year',
            style: 'border-color: white',
            class: 'mt-1 ml-1 year',
            id: 'Year',
            name: 'Year'
        })
        )

        if (data[0].Year != new Date().getFullYear() + 543) {
            for (let i = 0; i < data.length; i++) {
                values[i] = [data[i].Year]
            }
            values.push(new Date().getFullYear() + 543)

            for (let i = values.length - 1; i >= 0; i--) {
                $('.year').append($(document.createElement('option')).prop({
                    value: values[i],
                    text: values[i]
                }))

            }
            // console.log(data)
        } else {
            for (let i = 0; i < data.length; i++) {
                values[i] = [data[i].Year]

            }
            for (let i = 0; i < values.length; i++) {
                $('.year').append($(document.createElement('option')).prop({
                    value: values[i],
                    text: values[i]
                }))

            }
        }

        selected = $('#Year').val();
        // console.log(selected + '1111111')



        $('select.year').change(function () {
            selected = $(this).children("option:selected").val();
            getuser()
            // $.ajax({
            //     method: "GET",
            //     url: "/manageUser/showAllUser/" + selected
            // }).done(function (dataSet, state, xhr) {
            //     getuser()
            // }).fail(function (xhr, state, error) {
            // })
        })

    })

    $("#save").click(function () {
        let newmail = $("#editMail").val();

        if (!newmail || newmail.length === 0) {
            swal({
                title: "กรุณากรอกอีเมล",
                type: "info",
                showCancelButton: false,
                confirmButtonClass: "btn-primary rounded",
                confirmButtonText: "ตกลง",
                closeOnConfirm: true,
            })
        } else {
            $(".btn-sm").hide();
            $(".but").append('<input class="btn btn-sm" type="button" value = "ตกลง" onclick = "location.reload()" style="float: right; background-color: #0a72c1; color:white">')

            if (newmail.match(pattern)) {
                $.ajax({
                    method: "GET",
                    url: "/api/profile/infouser"
                }).done(function (dataSet, state, xhr) {

                    if (rol == "กรรมการ") {
                        rol = 2
                    } else if (rol == "ผู้ดูแลระบบ") {
                        rol = 1
                    }
                    var x = document.getElementById("admin2").checked;
                    if (x) {
                        rol = 1;
                    } else {
                        rol = 2
                    }
                    $.ajax({
                        method: "PUT",
                        url: "/api/manageUser/update/" + newmail + "/" + dataSet.email + "/" + rol + "/" + Email_user
                    }).done(function (data, state, xhr) {
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
                                }
                            });
                    }).fail(function (xhr, state, error) {

                        // swal({
                        //     title: "มีผู้ใช้นี้ในระบบแล้ว",
                        //     type: "info",
                        //     showCancelButton: false,
                        //     confirmButtonClass: "btn-primary rounded",
                        //     confirmButtonText: "ตกลง",
                        //     closeOnConfirm: true,
                        // })
                    });
                    // $.ajax({
                    //     method: "GET",
                    //     url: "/user/profile/inspectedItem/Total/Number1/" + data.email
                    // }).done(function (dataSet, state, xhr) {
                    //     $("#all").html(dataSet[0].Numbers_of_Inspected_Item);
                    // }).fail(function (xhr, state, error) {
                    //     //get data failed
                    //     $(".btn-sm").hide();
                    //     $(".but").append('<input class="btn btn-sm" type="button" value = "ตกลง" onclick = "location.reload()" style="float: right; background-color: #0a72c1; color:white">')
                    //     $(".alertText").html(xhr.responseText)
                    //     $("#alertmodal").modal();
                    // });
                }).fail(function (xhr, state, error) {
                    //get data failed
                    $(".btn-sm").hide();
                    $(".but").append('<input class="btn btn-sm" type="button" value = "ตกลง" onclick = "location.reload()" style="float: right; background-color: #0a72c1; color:white">')
                    $(".alertText").html(xhr.responseText)
                    $("#alertmodal").modal();
                });

            } else {

                swal({
                    title: "รูปแบบอีเมลไม่ถูกต้อง",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonClass: "btn-primary rounded",
                    confirmButtonText: "ตกลง",
                    closeOnConfirm: true,
                })
            }
        }

    });

    $("#save2").click(function () {
        let newmail = $("#addMail2").val();
        let Role;
        if (!newmail || newmail.length === 0) {

            swal({
                title: "กรุณากรอกอีเมล",
                type: "info",
                showCancelButton: false,
                confirmButtonClass: "btn-primary rounded",
                confirmButtonText: "ตกลง",
                closeOnConfirm: true,
            })
        }
        else {
            if (newmail.match(pattern)) {
                var g = document.getElementById("admin").checked;
                if (g) {
                    Role = 1;
                } else {
                    Role = 2
                }
                $.ajax({
                    method: "GET",
                    url: "/api/profile/infouser"
                }).done(function (dataSet, state, xhr) {
                    $.ajax({
                        method: "POST",
                        url: "/api/manageUser/add/" + newmail + "/" + dataSet.email + "/" + Role
                    }).done(function (data, state, xhr) {
                        $(".btn-sm").hide();
                        $(".but").append('<input class="btn btn-sm" type="button" value = "ตกลง" onclick = "location.reload()" style="float: right; background-color: #0a72c1; color:white">')

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
                                }
                            });

                    }).fail(function (xhr, state, error) {
                        swal({
                            title: "มีผู้ใช้นี้ในระบบแล้ว",
                            type: "info",
                            showCancelButton: false,
                            confirmButtonClass: "btn-primary rounded",
                            confirmButtonText: "ตกลง",
                            closeOnConfirm: true,
                        })
                    });

                }).fail(function (xhr, state, error) {

                });
            } else {

                swal({
                    title: "รูปแบบอีเมลไม่ถูกต้อง",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonClass: "btn-primary rounded",
                    confirmButtonText: "ตกลง",
                    closeOnConfirm: true,
                })
            }
        }
    });

    $.ajax({
        method: "GET",
        url: "/api/profile/infouser"
    }).done(function (data, state, xhr) {
        $("#user").html(data.name);
        EmailOfUser = data.email
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
                getuser();
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



    $('#adduser').on('click', function () {
        $(".bd-example-modal-lg").modal();

    });

    $('#myTable tbody ').on('click', '.deleteemail', function () {
        var data = table.row($(this).parents('tr')).data();
        Email_user = data.Email_user;

        swal({
            title: "ยืนยันการลบ " + Email_user + "",
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
                    $.ajax({
                        method: "GET",
                        url: "/api/user/profile/inspectedItem/Total/Number1/" + Email_user
                    }).done(function (dataSet, state, xhr) {
                        if (dataSet[0].Numbers_of_Inspected_Item == 0) {
                            $.ajax({
                                method: "DELETE",
                                url: "/api/manageUser/deleteAllUser/" + Email_user
                            }).done(function (dataSet, state, xhr) {
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
                                            getuser()
                                        }
                                    });
                            })
                        } else {
                            swal({
                                title: "ไม่สามารถลบได้",
                                text: "เนื่องจากผู้ใช้นี้ได้เริ่มตรวจนับแล้ว",
                                type: "info",
                                showCancelButton: false,
                                confirmButtonClass: "btn-primary rounded",
                                confirmButtonText: "ตกลง",
                                closeOnConfirm: true,
                            })
                        }
                    }).fail(function (xhr, state, error) {
                        //get data failed
                        $(".alertText").html(xhr.responseText)
                        $("#alertmodal").modal();
                    });
                }
            });
    })

    $('#myTable tbody ').on('click', '.editemail', function () {
        var data = table.row($(this).parents('tr')).data();
        Email_user = data.Email_user;
        rol = data.Role;

        $("#editMail").val(Email_user)
        $.ajax({
            method: "GET",
            url: "/api/profile/infouser"
        }).done(function (data, state, xhr) {
            $.ajax({
                method: "GET",
                url: "/api/user/profile/inspectedItem/Total/Number1/" + Email_user
            }).done(function (dataSet, state, xhr) {
                if (dataSet[0].Numbers_of_Inspected_Item == 0) {
                    $("#modaledit").modal('toggle');
                } else {
                    $(".btn-sm").hide();
                    $(".but").append('<input class="btn btn-sm" type="button" value = "ตกลง" onclick = "location.reload()" style="float: right; background-color: #0a72c1; color:white">')
                    swal({
                        title: "ไม่สามารถแก้ไขได้",
                        text: "เนื่องจากผู้ใช้นี้ได้เริ่มตรวจนับแล้ว",
                        type: "info",
                        showCancelButton: false,
                        confirmButtonClass: "btn-primary rounded",
                        confirmButtonText: "ตกลง",
                        closeOnConfirm: true,
                    })
                }
            }).fail(function (xhr, state, error) {
                alert(xhr);
            });
        }).fail(function (xhr, state, error) {
            alert(xhr);
        });
    });            
});

function getuser() {
    $.ajax({
        method: "GET",
        url: "/api/manageUser/showAlladminname"
    }).done(function (datas, state, xhr) {
        $.ajax({
            method: "GET",
            url: "/api/manageUser/showAllUser/" + selected
        }).done(function (dataSet, state, xhr) {
            // console.log(selected)
            if (dataSet.length == 0) {
                swal({
                    title: "ไม่พบบัญชีผู้ใช้",
                    type: "info",
                    confirmButtonClass: "btn-primary rounded",
                    confirmButtonText: "ตกลง",
                    closeOnConfirm: true,
                })
            }

            for (let i = 0; i < dataSet.length; i++) {
                if (dataSet[i].Role == 2) {
                    dataSet[i].Role = "กรรมการ"
                } else if (dataSet[i].Role == 1) {
                    dataSet[i].Role = "ผู้ดูแลระบบ"
                } else {
                    dataSet[i].Role = "ผู้ดูแลถาวร"
                }

                for (let j = 0; j < datas.length; j++) {
                    if (dataSet[i].Email_assigner == datas[j].Email_user) {
                        if (datas[j].Name !== null) {
                            dataSet[i].Email_assigner = datas[j].Name
                        }
                    }
                }

                if (dataSet[i].Name !== null) {
                } else {
                    dataSet[i].Name = dataSet[i].Email_user + "(ยังไม่ยืนยัน) "
                }
            }

            for (let i = 0; i < dataSet.length; i++) {
                if (dataSet[i].Email_user == EmailOfUser) {
                    // console.log(dataSet[i].Email_user + " " + EmailOfUser)
                    // console.log(dataSet)
                    dataSet.splice(i, 1)
                }
            }

            table.clear();
            //display modified JSON in DataTable
            table.rows.add(dataSet).draw();
            yearDis = new Date().getFullYear() + 543
            if (selected != yearDis) {
                $("#adduser").attr("disabled", true)
                $(".editemail").attr("disabled", true)
                $(".deleteemail").attr("disabled", true)
                $("#adduser").hide()
            }
            else {
                $("#adduser").show()
            }
            $('.3').hide();
            $('.ผู้ดูแลถาวร').hide();
        }).fail(function (xhr, state, error) {
            //get data failed
            $(".alertText").html(xhr.responseText)
        });
    })
}