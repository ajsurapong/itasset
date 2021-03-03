$(document).ready(function () {

    $.ajax({
        method: "GET",
        url: "/api/profile/infouser"
    }).done(function (data, state, xhr) {
        if (data.email === undefined) {

            $(".alertText").html("กรุณาเข้าสู่ระบบ")
            $("#alertmodal").modal();
        } else {
            $.ajax({
                method: "GET",
                url: "/api/manageUser/showAllUsers/" + data.email
            }).done(function (dataSet, state, xhr) {
                if (dataSet[0] === undefined) {
                    $("#alertmodal").modal();
                } else {

                    window.location.replace("/api/mainpage")
                }

            }).fail(function (xhr, state, error) {
                //get data failed
                alert(xhr.responseText);
            });
        }
    }).fail(function (xhr, state, error) {
        //get data failed
        alert(xhr.responseText);
    });
})