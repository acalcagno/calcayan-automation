exports.get_api_response = function(respuesta_del_modelo) {
    var acciones_del_modelo = respuesta_del_modelo.acciones_a_realizar;
    var respuesta_api = JSON.parse(JSON.stringify(respuesta_del_modelo)); //clone
    var acciones_api = respuesta_api.acciones_a_realizar;

    for (var i = 0; i < acciones_del_modelo.length; i++) {
        if (acciones_api[i].accion == "abrir") {
            acciones_api[i].accion = 1;
        }
        if (acciones_api[i].accion == "cerrar") {
            acciones_api[i].accion = 0;
        }

        if (acciones_api[i].accion == "encender") {
            acciones_api[i].accion = 1;
        }
        if (acciones_api[i].accion == "apagar") {
            acciones_api[i].accion = 0;
        }
    }
    return respuesta_api;
}