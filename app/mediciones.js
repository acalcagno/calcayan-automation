exports.nuevas_mediciones = function(mediciones) {
    var acciones = [];
    var accion_de_la_bomba_del_chiller = "apagar";
    var accion_de_la_bomba_del_calentador = "apagar";
    var accion_sobre_el_chiller = "apagar";
    var accion_sobre_el_calentador = "apagar";

    for (var i = 0; i < mediciones.length; i++) {

        if (mediciones[i].sensor == "chiller") {
            if (mediciones[i].temperatura >= 10) {
                accion_sobre_el_chiller = "encender";
                accion_de_la_bomba_del_chiller = "encender";
            }
        } else if(mediciones[i].sensor == "calentador") {
            if (mediciones[i].temperatura < 30) {
                accion_sobre_el_calentador = "encender";
            }
        } else if(mediciones[i].sensor.substring(0, "fermentador".length) == "fermentador" ) {
            var nro_fermentador = mediciones[i].sensor.substr(mediciones[i].sensor.length-1,1);
            if (mediciones[i].temperatura >= 21) {
                acciones.push({

                    "dispositivo": "electrovalvula_frio_fermentador_" + nro_fermentador.toString(),
                    "accion": "abrir"
                });
                accion_de_la_bomba_del_chiller = "encender";
            } else {
                acciones.push({
                    "dispositivo": "electrovalvula_frio_fermentador_" + nro_fermentador.toString(),
                    "accion": "cerrar"
                });
            }
            acciones.push({
                "dispositivo": "electrovalvula_calor_fermentador_" + nro_fermentador.toString(),
                "accion": "cerrar"
            });
        };
    }
    acciones.push({"dispositivo": "chiller", "accion": accion_sobre_el_chiller});
    acciones.push({"dispositivo": "bomba_chiller","accion": accion_de_la_bomba_del_chiller});
    acciones.push({"dispositivo": "calentador", "accion": accion_sobre_el_calentador});
    acciones.push({"dispositivo": "bomba_calentador", "accion": accion_de_la_bomba_del_calentador});


    return acciones;
};

