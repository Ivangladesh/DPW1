var session = sessionStorage.getItem("Session");

$(document).ready(function(){ 
    $.get("../views/menu.html", function(data) {
        $("#menu").html(data);
    });
    $("#div1").load("../views/validarSesion.html");
}); 