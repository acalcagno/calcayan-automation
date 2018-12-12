$(document).ready(function(){


    var handleErrors = function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }


    var acciono_control = function(event) {

        var req = {
            model_id: event.currentTarget.attributes.model_id.value,
        }

        if (event.currentTarget.attributes.accion) {
            req.accion= parseInt(event.currentTarget.attributes.accion.value)
        }
        if (event.currentTarget.attributes.control) {
            req.control = event.currentTarget.attributes.control.value
        }

        fetch('control', {  method: 'POST',
                            body: JSON.stringify(req),
                            headers: {"Content-Type": "application/json"}
                         }
        )
        .then(handleErrors)
        .then(response => console.log("response ok"))
        .catch(e => alert(e))
    }

    //les pone un nombre user frendly
    var formatear = function(dispositivos) {
        var disp = _.find(dispositivos, d => d.dispositivo == "bomba_chiller")
        disp.caption = "bomba"
        disp.accion = disp.accion == 1 ? "apagar" : "encender"
        disp.detalle = ''
        disp.config = ''
        disp.control = disp.control  == "manual" ? "manual" : "auto"

        disp = _.find(dispositivos, d => d.dispositivo == "chiller")
        disp.caption = "chiller"
        disp.accion = disp.accion == 1 ? "apagar" : "encender"
        disp.detalle = disp.temperatura + ' ºC'
        disp.config = disp.temp_ideal + 'ºC\t&plusmn; ' + disp.tolerancia + 'ºC'
        disp.control = disp.control  == "manual" ? "manual" : "auto"

        var ev1 =  _.find(dispositivos, d => d.dispositivo == "electrovalvula_frio_fermentador_1")
        disp =  _.find(dispositivos, d => d.dispositivo == "fermentador1")
        disp.caption = "fermentador 1"
        disp.accion = ev1.accion == 1 ? "cerrar" : "abrir"
        disp.detalle = disp.temperatura + ' ºC'
        disp.config = disp.temp_ideal + 'ºC\t&plusmn; ' + disp.tolerancia + 'ºC'
        disp._id = ev1._id //para el update
        disp.control = ev1.control == "manual" ? "manual" : "auto"

    }

    //solo muestro dispositivos que me interesen para el panel de control
    var filtrar = function(all_dispositivos) {
        var lista_filtro = ['bomba_chiller', 'chiller', 'fermentador1']
        return _.filter(all_dispositivos, d => _.some(lista_filtro, f => { return d.dispositivo == f }))
    }

    var deshabilitar_acciones_auto = function() {

    }

    var render_controls = function(all_dispositivos) {
        formatear(all_dispositivos)
        var dispositivos = filtrar(all_dispositivos)
        //property accion, renderiza "#encender", si su valor era "apagar" y vice versa
        var attr_to_controls_map = [{
            attr_name: "accion",
            map: [{
                attr_value: "encender",
                control_discriminator: "encender"
            }, {
                attr_value: "apagar",
                control_discriminator: "apagar"
            }, {
                attr_value: "cerrar",
                control_discriminator: "cerrar"
            }, {
                attr_value: "abrir",
                control_discriminator: "abrir"
            }] },

            { attr_name:"control",
            map:[ {
                attr_value: "manual",
                control_discriminator: "manual"
            }, {
                attr_value: "auto",
                control_discriminator: "auto"
            }]
        }]

        GrillaFrom('#dispositivos', dispositivos, attr_to_controls_map)
        $(".control").click(acciono_control)
    }

    var fetch_dispositivos = function() {
        fetch('dispositivos')
            .then(function(response) {
                return response.json();
            })
            .then(function(dispositivos) {
                render_controls(dispositivos)
                setTimeout(fetch_dispositivos, 500)
            })
    }

    fetch_dispositivos()

})