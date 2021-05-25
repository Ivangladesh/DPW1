$(document).ready(function(){ 

    if(sessionStorage.getItem("Session") !== null){
        validarSesion(sessionStorage.getItem("Session"));
    }

    $('#iniciarSesion').on('click', function (e) {
        if(validarCampos()){
            iniciarSesion();
            document.getElementById("frmLogin").reset();
        }
        e.preventDefault();
    });

    function iniciarSesion(e) {
        let datos = {
            Action: "IniciarSesion",
            Username: $("#txtUsername").val(),
            Password: btoa($("#txtPassword").val())
        }
        $.ajax({
            url: "../php/session.php",
            type: 'POST',
            data: datos,
            dataType: 'json'
        })
        .done(function (result, textStatus, jqXHR) {
            if(result[0].data !== null){
                sessionStorage.setItem("Session", result[0].data);
                validarSesion(result[0].data)
            }else{
                tempAlert("Usuario no encontrado. Ha ocurrido un error.",2000, false);
            }
        })
        .fail(function (result, textStatus, jqXHR) {
            console.log(result);
        });
    }

    function validarSesion(token) {
        const _token = token;
        let datos = {
            Action: "ValidarSesion",
            Token: token
        }
        $.ajax({
            url: "../php/session.php",
            type: 'POST',
            data: datos,
            dataType: 'json'
        })
        .done(function (result, textStatus, jqXHR) {
            if(result !== ''){
                if(result[0].status = 200 && result[0].data[0].CookieSession === _token){
                    if(self.location.pathname === "/DPW/views/login.html"){
                        setTimeout( function ( ) {
                            window.location.replace("../views/index.html");
                        }, 2000 );
                        tempAlert("Bienvendido " + result[0].data[0].NombreCompleto,2000, true);
                    } else{
                        tempAlert("Ha ocurrido un error.",2000, false);
                    }
                } else{
                    
                    window.location.replace("../views/login.html");
                }
            }

        })
        .fail(function (result, textStatus, jqXHR) {
            console.log(result);
        });
    }

    function tempAlert(msg,duration, state)
    {
        if(state){
            $(".mdl-teal-login").removeClass("mdl-teal-failure").addClass("mdl-teal-success");
        } else{
            $(".mdl-teal-login").removeClass("mdl-teal-success").addClass("mdl-teal-failure");
        }
        $('#mdl-user').html(msg);
        setTimeout(function(){
            $("#mdlBienvenida").hide();
        },duration);
        $("#mdlBienvenida").show();
    }

    function validarCampos() {
        var form = $('#frmLogin');
        var ok = false;
        $("input", form).each(function () {
            if ($(this).val() == "") {
                $(this).addClass('error');
                ok = false;
            }
            else {
                ok = true;
                $(this).removeClass('error');
            }
        });
        return ok;
    }


}); 