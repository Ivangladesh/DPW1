var session = sessionStorage.getItem("Session");

(function ($) {

    (function () {
        let input = document.getElementById('buscarRegistro');
        var timeout = null;
        input.addEventListener('keyup', function (e) {
            clearTimeout(timeout);
            timeout = setTimeout(function () { 
                buscarArticulo(input.value); 
            }, 800);
        });
    })();

    $('#agregarRegistro').on('click', function (e) {
        $('#divAgregarRegistro').show("fast");
        mostrarModal(null);
        e.preventDefault();
    });

    $('#guardarRegistro').on('click', function (e) {
        if(validarCampos()){
            if(confirm("Esta acción no se puede deshacer ¿Desea continuar?")){
                postRegistro("RegistrarArticulo", "Registro añadido");
            }
        }
        e.preventDefault();
    });

    $('#editarRegistro').on('click', function (e) {
        if(validarCampos()){
            if(confirm("Esta acción no se puede deshacer ¿Desea continuar?")){
                postRegistro("EditarArticulo", "Edición completada");
            }
        }
        e.preventDefault();
    });
    $('#eliminarRegistro').on('click', function(e){
        let id = $("#txtId").val();
        if(confirm("Esta acción no se puede deshacer ¿Desea continuar?")){
            eliminarArticulo(id);
        }
        e.preventDefault();
    });

    $('#tblInventario tbody').on('click', function (e) {
        let id = variable(e,0);
        let nombre = variable(e,1);
        let proveedor = variable(e,2);
        let fechaIngreso = variable(e,3);
        let cantidad = variable(e,4);
        let precio = variable(e,5);
        let datos = {
            id:id,
            nombre:nombre,
            proveedor:proveedor,
            fechaIngreso: fechaIngreso,
            cantidad:cantidad,
            precio:precio
        }
        mostrarModal(datos);
    });

    let variable = (e,i) =>{
        return e.target.parentNode.cells[i].innerText;
    }

    let obtenerInventario = () => {
        $.ajax({
            url: "../php/calls.php",
            type: 'GET',
            data: "ObtenerRegistros",
            dataType: "json"
        })
        .done(function (result, textStatus, jqXHR) {
            if(result.length > 0){
                poblarTabla(result);
            }
        })
        .fail(function (result, textStatus, jqXHR) {
            console.log(result);
        });
    }

    let buscarArticulo = (param) => {
        let datos = {
            Action: "BuscarRegistro",
            Parametro: param
        }
        $.ajax({
            url: "../php/calls.php",
            type: 'POST',
            data: datos,
            dataType: "json"
        })
        .done(function (result, textStatus, jqXHR) {
            if(result.length > 0){
                poblarTabla(result);
            }
        })
        .fail(function (result, textStatus, jqXHR) {
            console.log(result);
        });
    }

    let poblarTabla = (datos) =>{
        $('#tblInventario tbody').empty();
        let longitud = datos[0].data.length - 1;
        for (let i = 0; i <= longitud; i++) {
            $('#tblInventario tbody').append(
                '<tr>' +
                '<td>' + datos[0].data[i].Id + '</td>' +
                '<td>' + datos[0].data[i].Nombre + '</td>' +
                '<td>' + datos[0].data[i].Proveedor + '</td>' +
                '<td>' + datos[0].data[i].FechaIngreso + '</td>' +
                '<td>' + datos[0].data[i].Cantidad + '</td>' +
                '<td>' + datos[0].data[i].Precio + '</td>' +
                '</tr>'
            );
        };
    }

    let postRegistro = (accion, mensaje) => {
        let datos = {
            Action: accion,
            Nombre: $("#txtNombre").val(),
            Proveedor: $("#txtProveedor").val(),
            Cantidad: $("#txtCantidad").val(),
            Precio: $("#txtPrecio").val(),
            Id: $("#txtId").val()
        }
        $.ajax({
            url: "../php/calls.php",
            type: 'POST',
            data: datos
        })
            .done(function (result, textStatus, jqXHR) {
                if (result === "1") {
                    obtenerInventario();
                    document.getElementById("frmAgregarRegistro").reset();
                    $("#mdlRegistrar").hide("fast");
                    alerta(mensaje);
                }
            })
            .fail(function (result, textStatus, jqXHR) {
                console.log(result);
            });
    }

    let eliminarArticulo = (param) => {
        let datos = {
            Action: "EliminarArticulo",
            Id: param
        }
        $.ajax({
            url: "../php/calls.php",
            type: 'POST',
            data: datos
        })
        .done(function (result, textStatus, jqXHR) {
            if (result === "1") {
                obtenerInventario();
                $("#mdlRegistrar").hide("fast");
                alerta("Registro eliminado");
            }
        })
        .fail(function (result, textStatus, jqXHR) {
            console.log(result);
        });
    }

    const mostrarModal = (datos) => {
        if(datos !== null){
            $("#txtId").val(datos.id);
            $("#txtNombre").val(datos.nombre);
            $("#txtProveedor").val(datos.proveedor);
            $("#txtFechaIngreso").val(datos.fechaIngreso);
            $("#txtCantidad").val(datos.cantidad);
            $("#txtPrecio").val(datos.precio);
            $('.cls-nuevo-registro').hide();
            $('.cls-editar-registro').show();
        } else{
            $('.cls-editar-registro').hide();
            $('.cls-nuevo-registro').show();
            let fecha = crearFecha();
            $('#txtFechaIngreso').val(fecha);
        }
        $("#mdlRegistrar").show("fast");
        const span = document.getElementsByClassName("close")[0];
        span.onclick = function () {
            document.getElementById("frmAgregarRegistro").reset();
            $("#mdlRegistrar").hide("fast");
        }
    }

    const crearFecha = () => {
        const hoy = new Date();
        const dia = ("0" + hoy.getDate()).slice(-2);
        const mes = ("0" + (hoy.getMonth() + 1)).slice(-2);
        const fecha = hoy.getFullYear() + "-" + (mes) + "-" + (dia);
        return fecha;
    }

    const alerta = (msg) => {
        $('#notificacion').show();
        $("#notificacion").delay(5500).fadeOut(1500, "swing");
        $('#notMensaje').html(msg);
    }

    function validarCampos() {
        var form = $('#frmAgregarRegistro');
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

    obtenerInventario();

})(jQuery);