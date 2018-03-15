exports.nuevas_mediciones = function(mediciones, config, dispositivos) {
    var acciones = [];
    var accion_de_la_bomba_del_chiller = "apagar";
    var accion_de_la_bomba_del_calentador = "apagar";
    var accion_sobre_el_chiller = "apagar";
    var accion_sobre_el_calentador = "apagar";

    dispositivos = dispositivos || [];
    config = config || [{"dispositivo":"calentador", "temp_ideal": "30", "tolerancia":"5"}, {"dispositivo":"chiller", "temp_ideal": "30", "tolerancia":"5"}];

    for (var i = 0; i < mediciones.length; i++) {

        if (mediciones[i].sensor == "chiller") {
            var config_chiller = buscar_config("chiller", config);
            if (mediciones[i].temperatura >= config_chiller.temp_ideal + config_chiller.tolerancia) {
                accion_sobre_el_chiller = "encender";
                accion_de_la_bomba_del_chiller = "encender";
            } else if (mediciones[i].temperatura >= config_chiller.temp_ideal && dispositivo_desde("chiller", dispositivos).estado == "encendido") {
                accion_sobre_el_chiller = "encender";
                accion_de_la_bomba_del_chiller = "encender";
            }
        } else if(mediciones[i].sensor == "calentador") {
            var config_calentador = buscar_config("calentador", config);
            if (mediciones[i].temperatura < config_calentador.temp_ideal - config_calentador.tolerancia) {
                accion_sobre_el_calentador = "encender";
            } else if (mediciones[i].temperatura < config_calentador.temp_ideal && dispositivo_desde("calentador", dispositivos).estado == "encendido") {
                accion_sobre_el_calentador = "encender";
            }
        } else if(mediciones[i].sensor.substring(0, "fermentador".length) == "fermentador" ) {
            var nro_fermentador = mediciones[i].sensor.substr(mediciones[i].sensor.length-1, 1);
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

            if (mediciones[i].temperatura < 17) {
                acciones.push({
                    "dispositivo": "electrovalvula_calor_fermentador_" + nro_fermentador.toString(),
                    "accion": "abrir"
                });
                accion_de_la_bomba_del_calentador = "encender";
            } else {
                acciones.push({
                    "dispositivo": "electrovalvula_calor_fermentador_" + nro_fermentador.toString(),
                    "accion": "cerrar"
                });
            }
        };
    }
    acciones.push({"dispositivo": "chiller", "accion": accion_sobre_el_chiller});
    acciones.push({"dispositivo": "bomba_chiller","accion": accion_de_la_bomba_del_chiller});
    acciones.push({"dispositivo": "calentador", "accion": accion_sobre_el_calentador});
    dispositivo_desde("calentador", dispositivos).estado = accion_sobre_el_calentador;
    acciones.push({"dispositivo": "bomba_calentador", "accion": accion_de_la_bomba_del_calentador});


    return acciones;
};

buscar_config = function(key, cfg) {
    var result = cfg.filter(function(each) {
        var len = key.length;
        return each.dispositivo.substring(0,len) == key;
    });
    return result[0];

}

dispositivo_desde = function (nombre_dispositivo, dispositivos) {
    var result = dispositivos.filter(function(each) {
        var len = nombre_dispositivo.length;
        return each.dispositivo.substring(0,len) == nombre_dispositivo;
    });
    if (result.length == 0) return {"dispositivo": nombre_dispositivo, "accion":"none"};
    return result[0];
}