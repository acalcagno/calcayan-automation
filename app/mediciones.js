exports.nuevas_mediciones = function(mediciones) {
    var acciones = [];
    var accion_de_la_bomba = "apagar";
    for (var i = 0; i < mediciones.length; i++) {
        if (mediciones[i].temperatura >= 21) {
            acciones.push({"dispositivo": "electrovalvula_" + (i+1).toString(), "accion": "abrir"});
            accion_de_la_bomba = "encender";
        } else {
            acciones.push({"dispositivo": "electrovalvula_" + (i+1).toString(), "accion": "cerrar"});
        }
    }
    acciones.push({ "dispositivo": "bomba","accion": accion_de_la_bomba});

    var accion_chiller = "apagar";

    //if (chiller) -> accion_chiller = "encendido";
    acciones.push({ "dispositivo": "chiller","accion": accion_chiller});
    return acciones;
};

