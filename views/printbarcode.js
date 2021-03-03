$(document).ready(function () {
    var k = 0;
    if (sessionStorage !== undefined) {
        let array = sessionStorage.selectedItemBR;
        let data = JSON.parse(array)
        var k = 0;
        for (var i = 0; i < Math.ceil(data.length / 4); i++) {
            $("#qrcode").append("<sapn class='row mb-5' id='aa" + [i] + "' ></span>")
            for (let j = 0; j < 4; j++) {
                if (k == data.length) {

                }
                else {
                    $("#aa" + [i] + "").append("<svg class='col-md-3 col-sm-1 col-lg-3' id='bb" + [j] + "' ></svg> ")

                    JsBarcode("#aa" + [i] + " #bb" + [j] + "", + data[k], {
                        height: 50,
                    });
                    k++
                }
            }
        }
    }
});

function printDiv(divName) {
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
}