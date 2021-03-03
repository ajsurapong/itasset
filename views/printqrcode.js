$(document).ready(function () {
    const data = JSON.parse(sessionStorage.getItem("selectedItemQR"));
    // let data = ['672000500349004', '772000500349004', '872000500349004', '972000500349004', '072000500349004', '172000500349004'];
    var k = 0;  //qrcode counter
    
    // Generate qrcode to two columns
    for (var i = 0; i < Math.ceil(data.length / 2); i++) {
        //create a row
        $("#qrcode").append("<div class='row my-2' id=row" + i + "></div>");

        // Here we can use loop if we want to create more than two columns
        // but using two manual columns help formatting left and right columns differently
        // add left column
        $("#row" + i).append("<div class='col-3 my-2'><div id=qr" + i + "0></div></div>")
        new QRCode(document.querySelector("#qr" + i + "0"), { width: 100, height: 100, }).makeCode(data[k]);
        $("#qr" + i + "0").append("<div style = 'font-weight: bold;font-size: 12px;'>" + data[k] + "</div>");
        k++;

        if(k<data.length) {
            // add right column
            $("#row" + i).append("<div class='col-3 my-2'><div id=qr" + i + "1></div></div>")
            new QRCode(document.querySelector("#qr" + i + "1"), { width: 100, height: 100, }).makeCode(data[k]);
            $("#qr" + i + "1").append("<div style = 'font-weight: bold;font-size: 12px;'>" + data[k] + "</div>");                    
        }
        k++;
    }
});

function printDiv(divName) {
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    //print without button
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
}