$(document).ready(function(){

    var formatear = function(dispositivos) {
        var disp = _.find(dispositivos, d => d.dispositivo == "bomba_chiller")
        disp.caption = "bomba"

        disp = _.find(dispositivos, d => d.dispositivo == "chiller")
        disp.caption = "chiller"
    }

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
                                                    control_id: "#apagar"
                                            }, {
                                                    attr_value: "apagar",
                                                    control_id: "#encender"
                                            }]
                                    }]

        GrillaFrom('#dispositivos', dispositivos, attr_to_controls_map)

    }

    var fetch_dispositivos = function() {
        fetch('dispositivos')
            .then(function(response) {
                return response.json();
            })
            .then(function(dispositivos) {
                render_controls(dispositivos)
            })
    }

    fetch_dispositivos()
})