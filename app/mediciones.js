exports.nuevas_mediciones = function(mediciones) {
    var acciones = [];
    var estado_de_la_bomba = "apagada";
    for (var i = 0; i < mediciones.length; i++) {
        if (mediciones[i].temperatura >= 21) {
            acciones.push({"dispositivo": "electrovalvula_" + (i+1).toString(), "estado": "abierta"});
            estado_de_la_bomba = "encendida";
        } else {
            acciones.push({"dispositivo": "electrovalvula_" + (i+1).toString(), "estado": "cerrada"});
        }
    }
    acciones.push({ "dispositivo": "bomba","estado": estado_de_la_bomba});

    var estado_chiller = "apagado"

    //if (chiller) -> estado_chiller = "encendido";
    acciones.push({ "dispositivo": "chiller","estado": estado_chiller});
    return acciones;
};

