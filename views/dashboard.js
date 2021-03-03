var table
var user
$(document).ready(function () {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear() + 543;

    today = yyyy + '-' + mm + '-' + dd;

    $(".atyear1").html(yyyy)

    //====================================== drop down year ======================================
    $.ajax({
        method: "GET",
        url: "/api/item/Year"
    }).done(function (data, state, xhr) {

        if (data.length == 0) {
            swal({
                title: "ไม่พบข้อมูลครุภัณฑ์",
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
        else {
            $.ajax({
                method: "GET",
                url: "/api/item/dashboard/number1/" + data[0].Year
            }).done(function (dataSet, state, xhr) {
                $("#all").html(dataSet[0].Numbers_of_item);
            })
            $.ajax({
                method: "GET",
                url: "/api/item/dashboard/number2/0/" + data[0].Year
            }).done(function (dataSet, state, xhr) {
                $("#dis").html(dataSet[0].Numbers_of_item);
            })

            $.ajax({
                method: "GET",
                url: "/api/item/dashboard/number2/1/" + data[0].Year
            }).done(function (dataSet, state, xhr) {
                $("#normal").html(dataSet[0].Numbers_of_item);
            })
            $.ajax({
                method: "GET",
                url: "/api/item/dashboard/number2/2/" + data[0].Year
            }).done(function (dataSet, state, xhr) {
                $("#fix").html(dataSet[0].Numbers_of_item);
            })
            $.ajax({
                method: "GET",
                url: "/api/year/iteem"
            }).done(function (data, state, xhr) {
                let nor = parseInt($("#normal").html());
                let fix = parseInt($("#fix").html());
                let dis = parseInt($("#dis").html());

                $('#bar-chart').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Amount of stuff in inventory'
                    },
                    subtitle: {
                        text: 'ข้อมูลคุรุภัณฑ์ของสำนักวิชาเทคโนโลยีสารสนเทศ'
                    },
                    xAxis: {
                        categories: [
                            'item'
                        ],
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'amount of item (จำนวนคุรุภัณฑ์)'
                        }
                    },
                    tooltip: {

                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: 'ปกติ',
                        data: [nor],
                        color: '#73e2a9'

                    }, {
                        name: 'เสื่อมสภาพ',
                        data: [fix],
                        color: '#fdc538'

                    }, {
                        name: 'สูญหาย',
                        data: [dis],
                        color: '#fa986d'

                    },
                    ]
                });

            })

            var values = [];
            let count = 0
            if (data.length > 5) {
                count = 5
            } else {
                count = data.length
            }
            for (let i = count - 1; i >= 0; i--) {
                values[i] = [data[i].Year]
            }

            $('.year').append($(document.createElement('select')).prop({

                class: 'year',
                name: 'year',
                style: 'border-color: white',
                class: 'ml-2 mt-1 year',
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

            $('select.year').change(function () {
                var selected = $(this).children("option:selected").val();

                $.ajax({
                    method: "GET",
                    url: "/api/item/dashboard/number1/" + selected
                }).done(function (dataSet, state, xhr) {
                    $("#all").html(dataSet[0].Numbers_of_item);
                })
                $.ajax({
                    method: "GET",
                    url: "/api/item/dashboard/number2/0/" + selected
                }).done(function (dataSet, state, xhr) {
                    $("#dis").html(dataSet[0].Numbers_of_item);
                })

                $.ajax({
                    method: "GET",
                    url: "/api/item/dashboard/number2/1/" + selected
                }).done(function (dataSet, state, xhr) {
                    $("#normal").html(dataSet[0].Numbers_of_item);
                })
                $.ajax({
                    method: "GET",
                    url: "/api/item/dashboard/number2/2/" + selected
                }).done(function (dataSet, state, xhr) {
                    $("#fix").html(dataSet[0].Numbers_of_item);
                })
                $.ajax({
                    method: "GET",
                    url: "/api/year/iteem"
                }).done(function (data, state, xhr) {
                    let nor = parseInt($("#normal").html());
                    let fix = parseInt($("#fix").html());
                    let dis = parseInt($("#dis").html());
                    chart = $('#bar-chart').highcharts();

                    chart.series[0].update({
                        data: [nor]
                    }, false);

                    chart.series[1].update({
                        data: [fix]
                    }, false);

                    chart.series[2].update({
                        data: [dis]
                    }, false);

                    chart.redraw();
                })

                $.ajax({
                    method: "GET",
                    url: "/api/item/dashboard/showAllInfo4/" + selected
                }).done(function (dataSet, state, xhr) {
                    for (let i = 0; i < dataSet.length; i++) {
                        if (dataSet[i].Status == 0) {
                            dataSet[i].Status = "สูญหาย"
                        } else if (dataSet[i].Status == 1) {
                            dataSet[i].Status = "ปกติ"
                        } else if (dataSet[i].Status == 2) {
                            dataSet[i].Status = "เสื่อมสภาพ"
                        }
                    }
                })
            })
        }

    })

    $.ajax({
        method: "GET",
        url: "/api/profile/infouser"
    }).done(function (data, state, xhr) {
        user = data.email
        $("#user").html(data.name);
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
                    $("#DateManage").hide();
                    $("#manageu").hide();
                    $("#admin_history").hide();
                    $("#News_announce").hide();
                }
                if (dataSet[0].Role == 1 || dataSet[0].Role == 3) {
                    $("#userhistory").hide();

                }
                for (let i = 0; i < dataSet.length; i++) {
                    if (dataSet[i].Role == 2) {
                        dataSet[i].Role = "กรรมการ"
                    } else if (dataSet[i].Role == 1 || dataSet[i].Role == 3) {
                        dataSet[i].Role = "ผู้ดูแลระบบ"
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
});
