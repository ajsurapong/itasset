$(document).ready(function () {
    // get the latest year from dropdown
    var year = $("#selectYear").val();
    $.ajax({
        type: "GET",
        url: "/api/stat/" + year,
        success: function (response) {
            $("#all").text(response[0].normal + response[0].degraded + response[0].lost);
            $("#normal").text(response[0].normal);
            $("#degraded").text(response[0].degraded);
            $("#lost").text(response[0].lost);
        },
        error: function(xhr) {
            alert(xhr.responseText);
        }
    });

    // when dropdown year changes
    $("#selectYear").change(function () { 
        // alert($(this).val());
        year = $(this).val();
        $.ajax({
            type: "GET",
            url: "/api/stat/" + year,
            success: function (response) {
                $("#all").text(response[0].normal + response[0].degraded + response[0].lost);
                $("#normal").text(response[0].normal);
                $("#degraded").text(response[0].degraded);
                $("#lost").text(response[0].lost);
            },
            error: function(xhr) {
                alert(xhr.responseText);
            }
        });
    });
});