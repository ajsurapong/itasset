var table;
$(document).ready(function () {
    $(".atyear1").html(new Date().getFullYear() + 543)

    table = $('#myTable').DataTable({

        columns: [
            {
                "mData": "Image", title: "รูปภาพ",
                "render": function (data) {
                    return '<img class="pic" src="' + data + '"style="width: 100px;margin: 25px;-webkit-transition: all .4s ease-in-out;-moz-transition: all .4s ease-in-out;-o-transition: all .4s ease-in-out; -ms-transition: all .4s ease-in-out; "/>';
                }
            },
            { data: "Inventory_Number", title: "รหัสครุภัณฑ์" },
            { data: "Department", title: "แผนกที่ดูแล" },
            { data: "Date_Upload", title: "วันที่นำเข้า" },
            { data: "Date_scan", title: "วันที่ตรวจสอบ" },
            { data: "Status", title: "สถานะ" }

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
                if (dataSet[0] === undefined) {

                    window.location.replace("/api/checkpage")
                }
                if (dataSet[0].Role == 2) {
                    $("#DateManage").hide();
                    $("#manageu").hide();
                    $("#News_announce").hide();
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

        //====================================== drop down year ======================================
        $.ajax({
            method: "GET",
            url: "/api/item/Yearuser/" + data.email
        }).done(function (datayear, state, xhr) {
            if (datayear == 0) {

            } else {
                var selectedyear = datayear[0].Year
                var values = [];
                let count = 0
                if (datayear.length > 5) {
                    count = 5
                } else {
                    count = datayear.length
                }
                for (let i = count - 1; i >= 0; i--) {
                    values[i] = [datayear[i].Year]
                }

                $('.year').append($(document.createElement('select')).prop({

                    class: 'year',
                    name: 'year',
                    style: 'background-color: #efeff6',
                    class: 'mt-3 year',
                    id: 'Year',
                    name: 'Year'
                })
                )

                //drop down status year
                for (let i = 0; i < values.length; i++) {
                    $('#Year').append($(document.createElement('option')).prop({
                        value: values[i],
                        text: values[i],
                        class: values[i]
                    }))
                }

                $.ajax({
                    method: "GET",
                    url: "/api/item/dashboard/number1all/" + datayear[0].Year + "/" + data.email
                }).done(function (dataSet, state, xhr) {
                    $("#all").html(dataSet[0].Numbers_of_item);
                })
                $.ajax({
                    method: "GET",
                    url: "/api/item/dashboard/number2user/0/" + datayear[0].Year + "/" + data.email
                }).done(function (dataSet, state, xhr) {
                    $("#dis").html(dataSet[0].Numbers_of_item);
                })

                $.ajax({
                    method: "GET",
                    url: "/api/item/dashboard/number2user/1/" + datayear[0].Year + "/" + data.email
                }).done(function (dataSet, state, xhr) {
                    $("#normal").html(dataSet[0].Numbers_of_item);
                })
                $.ajax({
                    method: "GET",
                    url: "/api/item/dashboard/number2user/2/" + datayear[0].Year + "/" + data.email
                }).done(function (dataSet, state, xhr) {
                    $("#fix").html(dataSet[0].Numbers_of_item);
                })

                $('#myTable tbody').on('click', 'tr', function () {
                    var data = table.row(this).data();
                    var inven = data.Inventory_Number
                    console.log(inven)
                    $.ajax({
                        method: "GET",
                        url: "/api/item5/" + inven + '/' + selectedyear
                    }).done(function (dataSet, state, xhr) {

                        if (dataSet[0].Image === null) {
                            var PopImage = "/img/noimg.png"
                        }
                        else {
                            PopImage = "/upload/Image/" + dataSet[0].Image
                        }
                        document.getElementById('picmodal').src = PopImage;
                        $(".date").html(" <strong>วันที่ได้รับ :</strong> " + dataSet[0].Received_date + '<br>' + "<strong> วันที่นำเข้า :</strong>" + dataSet[0].Date_Upload)
                        $("#Inventory_Number").html(dataSet[0].Inventory_Number)
                        $("#des").html("<strong>คำอธิบาย :</strong> " + dataSet[0].Asset_Description)
                        $("#mod").html("<strong>โมเดล : </strong>" + dataSet[0].Model + '<br>' + "  <strong>ซีเรียล : </strong>" + dataSet[0].Serial + '<br>' + " <strong>สถานที่ : </strong>" + dataSet[0].Location + "-" + dataSet[0].Room)
                        $("#cos").html("<strong>รหัสแผนก : </strong>" + dataSet[0].Cost_center + '<br>' + "   <strong>แผนกที่จัดเก็บ : </strong>" + dataSet[0].Department)
                        $("#value").html("<strong>มูลค่า : </strong>" + dataSet[0].Original_value + '<br>' + "   <strong>แหล่งที่มา : </strong>" + dataSet[0].Vendor_name)
                        $(".bd-example-modal-lg").modal();

                    }).fail(function (xhr, state, error) {
                        //get data failed
                        alert(xhr.responseText);
                    });
                });

                $.ajax({
                    method: "GET",
                    url: "/api/item/showAllInfoall/" + selectedyear + "/" + data.email
                }).done(function (dataall, state, xhr) {

                    for (let i = 0; i < dataall.length; i++) {
                        if (dataall[i].Status == 0) {
                            dataall[i].Status = "สูญหาย"
                        } else if (dataall[i].Status == 1) {
                            dataall[i].Status = "ปกติ"
                        } else if (dataall[i].Status == 2) {
                            dataall[i].Status = "เสื่อมสภาพ"
                        }
                        var nf = new Intl.NumberFormat();
                        dataall[i].Original_value = nf.format(dataall[i].Original_value);
                        if (dataall[i].Image === null) {
                            dataall[i].Image = "/img/noimg.png"
                        }
                        else {
                            let img = dataall[i].Image
                            dataall[i].Image = '/upload/Image/' + img
                            console.log('Status Image')
                        }
                    }
                    table.clear();
                    //display modified JSON in DataTable
                    table.rows.add(dataall).draw();
                })

                //====================================== drop down location befor select year ======================================
                $.ajax({
                    method: "GET",
                    url: "/api/item/Location/" + data.email + "/" + selectedyear
                }).done(function (dataloca, state, xhr) {
                    let thimail = data.email;
                    var values = [];
                    for (let i = 0; i < dataloca.length; i++) {
                        values[i] = [dataloca[i].Location]
                    }
                    values[dataloca.length] = 'สถานที่'
                    $('.btnGroupDrop1')
                        .append(
                            $(document.createElement('select')).prop({
                                style: 'border-color: white',
                                class: 'mt-3 ml-3 location',
                                id: 'Location',
                                name: 'Location'
                            })
                        )

                    //drop down Location
                    for (let i = values.length - 1; i >= 0; i--) {
                        $('#Location').append($(document.createElement('option')).prop({
                            value: values[i],
                            text: values[i],
                            class: values[i]
                        }))
                    }
                    $('.สถานที่').hide()

                    $('select.location').change(function () {
                        var selected = $(this).children("option:selected").val();
                        $("#Status").val("สถานะ")
                        $.ajax({
                            method: "GET",
                            url: "/api/item/dashboard/showAllInfo/" + selected + "/" + thimail + "/" + selectedyear
                        }).done(function (dataSet, state, xhr) {

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
                                }
                                else {
                                    let img = dataSet[i].Image
                                    dataSet[i].Image = '/upload/Image/' + img
                                }
                            }

                            table.clear();
                            //display modified JSON in DataTable
                            table.rows.add(dataSet).draw();
                        })
                    })
                })

                //====================================== drop down status ======================================
                $.ajax({
                    method: "GET",
                    url: "/api/item/Status/" + data.email + "/" + selectedyear
                }).done(function (datastatus, state, xhr) {

                    var values = [];
                    for (let i = 0; i < datastatus.length; i++) {
                        if (datastatus[i].Status == 0) {
                            values[i] = "สูญหาย"
                        } else if (datastatus[i].Status == 1) {
                            values[i] = "ปกติ"
                        } else if (datastatus[i].Status == 2) {
                            values[i] = "เสื่อมสภาพ"
                        }

                    } values[datastatus.length] = 'สถานะ'
                    $('.btnGroupDrop2')

                        .append(
                            $(document.createElement('select')).prop({
                                style: 'border-color: white',
                                class: 'mt-3 ml-3 status',
                                id: 'Status',
                                name: 'Status'
                            })
                        )

                    //drop down status Location
                    for (let i = values.length - 1; i >= 0; i--) {
                        $('#Status').append($(document.createElement('option')).prop({
                            value: values[i],
                            text: values[i],
                            class: values[i]
                        }))
                    }
                    $('.สถานะ').hide()
                    $('select.status').change(function () {
                        var selected = $(this).children("option:selected").val();
                        $("#Location").val('สถานที่')
                        if (selected == "สูญหาย") {
                            selected = 0
                        } else if (selected == "ปกติ") {
                            selected = 1
                        } else if (selected == "เสื่อมสภาพ") {
                            selected = 2
                        }

                        $.ajax({
                            method: "GET",
                            url: "/api/item/dashboard/showAllInfo1/" + selected + "/" + data.email + "/" + selectedyear
                        }).done(function (dataSet, state, xhr) {

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
                                }
                                else {
                                    let img = dataSet[i].Image
                                    dataSet[i].Image = '/upload/Image/' + img
                                }
                            }
                            table.clear();
                            //display modified JSON in DataTable
                            table.rows.add(dataSet).draw();
                        })
                    })
                })

                $('select.year').change(function () {
                    selectedyear = $(this).children("option:selected").val();

                    $.ajax({
                        method: "GET",
                        url: "/api/item/dashboard/number1all/" + selectedyear + "/" + data.email
                    }).done(function (dataSet, state, xhr) {
                        $("#all").html(dataSet[0].Numbers_of_item);
                    })
                    $.ajax({
                        method: "GET",
                        url: "/api/item/dashboard/number2user/0/" + selectedyear + "/" + data.email
                    }).done(function (dataSet, state, xhr) {
                        $("#dis").html(dataSet[0].Numbers_of_item);
                    })

                    $.ajax({
                        method: "GET",
                        url: "/api/item/dashboard/number2user/1/" + selectedyear + "/" + data.email
                    }).done(function (dataSet, state, xhr) {
                        $("#normal").html(dataSet[0].Numbers_of_item);
                    })
                    $.ajax({
                        method: "GET",
                        url: "/api/item/dashboard/number2user/2/" + selectedyear + "/" + data.email
                    }).done(function (dataSet, state, xhr) {
                        $("#fix").html(dataSet[0].Numbers_of_item);
                    })
                    $.ajax({
                        method: "GET",
                        url: "/api/item/showAllInfoall/" + selectedyear + "/" + data.email
                    }).done(function (dataall, state, xhr) {

                        for (let i = 0; i < dataall.length; i++) {
                            if (dataall[i].Status == 0) {
                                ddataall[i].Status = "สูญหาย"
                            } else if (dataall[i].Status == 1) {
                                dataall[i].Status = "ปกติ"
                            } else if (dataall[i].Status == 2) {
                                dataall[i].Status = "เสื่อมสภาพ"
                            }
                            var nf = new Intl.NumberFormat();
                            dataall[i].Original_value = nf.format(dataall[i].Original_value);
                            if (dataall[i].Image === null) {
                                dataall[i].Image = "/img/noimg.png"
                            }
                            else {
                                let img = dataall[i].Image
                                dataall[i].Image = '/upload/Image/' + img
                                console.log('Status Image')
                            }
                        }
                        table.clear();
                        //display modified JSON in DataTable
                        table.rows.add(dataall).draw();
                    })
                    $("#Location").remove();
                    $("#Status").remove();
                    //====================================== drop down location ======================================
                    $.ajax({
                        method: "GET",
                        url: "/api/item/Location/" + data.email + "/" + selectedyear
                    }).done(function (dataloca, state, xhr) {
                        let thimail = data.email;
                        var values = [];
                        for (let i = 0; i < dataloca.length; i++) {
                            values[i] = [dataloca[i].Location]
                        }
                        values[dataloca.length] = 'สถานที่'
                        $('.btnGroupDrop1')
                            .append(
                                $(document.createElement('select')).prop({
                                    style: 'border-color: white',
                                    class: 'mt-3 ml-3 location',
                                    id: 'Location',
                                    name: 'Location'
                                })
                            )

                        //drop down Location
                        for (let i = values.length - 1; i >= 0; i--) {
                            $('#Location').append($(document.createElement('option')).prop({
                                value: values[i],
                                text: values[i],
                                class: values[i]
                            }))
                        }
                        $('.สถานที่').hide()
                        $('select.location').change(function () {
                            var selected = $(this).children("option:selected").val();
                            $("#Status").val("สถานะ")
                            $.ajax({
                                method: "GET",
                                url: "/api/item/dashboard/showAllInfo/" + selected + "/" + thimail + "/" + selectedyear
                            }).done(function (dataSet, state, xhr) {

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
                                    }
                                    else {
                                        let img = dataSet[i].Image
                                        dataSet[i].Image = '/upload/Image/' + img

                                    }
                                }

                                table.clear();
                                //display modified JSON in DataTable
                                table.rows.add(dataSet).draw();
                            })
                        })
                    })
                    //====================================== drop down status ======================================
                    $.ajax({
                        method: "GET",
                        url: "/api/item/Status/" + data.email + "/" + selectedyear
                    }).done(function (datastatus, state, xhr) {

                        var values = [];
                        for (let i = 0; i < datastatus.length; i++) {
                            if (datastatus[i].Status == 0) {
                                values[i] = "สูญหาย"
                            } else if (datastatus[i].Status == 1) {
                                values[i] = "ปกติ"
                            } else if (datastatus[i].Status == 2) {
                                values[i] = "เสื่อมสภาพ"
                            }

                        } values[datastatus.length] = 'สถานะ'
                        $('.btnGroupDrop2')
                            .append(
                                $(document.createElement('select')).prop({
                                    style: 'border-color: white',
                                    class: 'mt-3 ml-3 status',
                                    id: 'Status',
                                    name: 'Status'
                                })
                            )

                        //drop down status Location
                        for (let i = values.length - 1; i >= 0; i--) {
                            $('#Status').append($(document.createElement('option')).prop({
                                value: values[i],
                                text: values[i],
                                class: values[i]
                            }))
                        }
                        $('.สถานะ').hide()
                        $('select.status').change(function () {
                            var selected = $(this).children("option:selected").val();
                            // $("#Location").val('สถานที่')
                            if (selected == "สูญหาย") {
                                selected = 0
                            } else if (selected == "ปกติ") {
                                selected = 1
                            } else if (selected == "เสื่อมสภาพ") {
                                selected = 2
                            }

                            $.ajax({
                                method: "GET",
                                url: "/api/item/dashboard/showAllInfo1/" + selected + "/" + data.email + "/" + selectedyear
                            }).done(function (dataSet, state, xhr) {
                                // console.log("aaaaaaaaaa")
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
                                    }
                                    else {
                                        let img = dataSet[i].Image
                                        dataSet[i].Image = '/upload/Image/' + img
                                        console.log('Status Image')
                                    }
                                }
                                table.clear();
                                //display modified JSON in DataTable
                                table.rows.add(dataSet).draw();
                            })
                        })
                    })
                })
            }

        })

    }).fail(function (xhr, state, error) {
        //get data failed
        $(".alertText").html(xhr.responseText)
        $("#alertmodal").modal();
    });
});