$(document).ready(function(){


    var handleErrors = function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }


    var acciono_control = function(event) {
        fetch('control', {  method: 'POST',
                            body: JSON.stringify({
                                model_id: event.currentTarget.attributes.model_id.value,
                                accion: parseInt(event.currentTarget.attributes.accion.value)
                            }),
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

        disp = _.find(dispositivos, d => d.dispositivo == "chiller")
        disp.caption = "chiller"
        disp.accion = disp.accion == 1 ? "apagar" : "encender"
    }

    //solo muestro dispositivos que me interesen para el panel de control
    var filtrar = function(all_dispositivos) {
        var lista_filtro = ['bomba_chiller', 'chiller']
        return _.filter(all_dispositivos, d => _.some(lista_filtro, f => { return d.dispositivo == f }))
    }


    var render_controls = function(all_dispositivos) {
        var dispositivos = filtrar(all_dispositivos)
        formatear(dispositivos)

        //property accion, renderiza "#encender", si su valor era "apagar" y vice versa
        var attr_to_controls_map = [{ attr_name: "accion",
                                        map: [ {
                                                    attr_value: "encender",
                                                    control_id: "#encender"
                                            }, {
                                                    attr_value: "apagar",
                                                    control_id: "#apagar"
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