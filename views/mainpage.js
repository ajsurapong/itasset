$(document).ready(function () {
    $(".atyear1").html(new Date().getFullYear() + 543)
    $("#all").click(function () {
        window.location.replace("/api/dashboard");
    });
    getItem();
    Loadannounce();
});

function Loadannounce() {
    $.ajax({
        method: "GET",
        url: "/api/Loadannounce"
    }).done(function (dataSet, state, xhr) {
        let count = dataSet.length
        if (dataSet.length > 5) {
            count = 5
        }
        for (var i = 0; i < count; i++) {
            $("#numberofcar").append('<li data-target="#carouselExampleIndicators" data-slide-to="' + i + '" id="car' + i + '"></li>')

            $("#carphoto").append('<div class="carousel-item slide" id="carphoto' + i + '"><div class="card shadow p-3 mb-1 bg-white rounded" style="color: black;"><div class="row mb-3"><div class="col-sm-7"><div class="card-body"> <div><span>' +
                '<div> <h3 id="title' + i + '"> </h3> </div>' + dataSet[i].Head + '</span></div> <br><p>' + dataSet[i].Detail +
                '</p> ประกาศเมื่อ ' + dataSet[i].DateEndCreate + ' <br> <br> <br></div> </div><div class="col-sm-5 mt-5"> <img class="card-img-top mx-auto" id="Announcephoto' + i +
                '" src="" alt="Card image" style="width:80%" height="90%"> </div>   </div> </div></div>')
            if (dataSet[i].Status == 1) {

                $('#Announcephoto' + i + '').prop("src", "/img/meeting.jpg");
                document.getElementById("title" + i + "").innerHTML = "ประชุม";

            } else if (dataSet[i].Status == 2) {
                document.getElementById("title" + i + "").innerHTML = "ประชาสัมพันธ์";
                $('#Announcephoto' + i + '').prop("src", "/img/normal.jpg");
            }
        }
        $("#car0").addClass("active");
        $("#carphoto0").addClass("active");
    }).fail(function (xhr, state, error) {

    })
}

function getItem() {
    //get users from DB
    $.ajax({
        method: "GET",
        url: "/api/profile/infouser"
    }).done(function (data, state, xhr) {
        $(".user").html(data.name);
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

        ///////////////////////////เพิ่มชื่อ ในดาต้าเบส ////////////////////////////
        // $.ajax({
        //     method: "PUT",
        //     url: "/api/manageUser/updatename/" + data.name + "/" + data.email
        // }).done(function (data, state, xhr) {


        // }).fail(function (xhr, state, error) {
        //     //get data failed

        // });
    }).fail(function (xhr, state, error) {
        //get data failed
        $(".alertText").html(xhr.responseText)
        $("#alertmodal").modal();
    });
}