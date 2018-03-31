exports.nuevas_mediciones = function(mediciones, config, dispositivos) {
    var acciones = [];
    var accion_de_la_bomba_del_chiller = "apagar";
    var accion_de_la_bomba_del_calentador = "apagar";
    var accion_sobre_el_chiller = "apagar";
    var accion_sobre_el_calentador = "apagar";

    dispositivos = dispositivos || [];

    //config por defecto
    config = config || [{"dispositivo":"calentador", "temp_ideal": 30, "tolerancia":5},
        {"dispositivo":"chiller", "temp_ideal": 30, "tolerancia":5},
        {"dispositivo":"bomba_chiller", "control": "automatico"},
        {"dispositivo":"fermentador1", "temp_ideal": 19, "tolerancia":2},
        {"dispositivo":"fermentador2", "temp_ideal": 19, "tolerancia":2},
        {"dispositivo":"fermentador3", "temp_ideal": 19, "tolerancia":2},
        {"dispositivo": "electrovalvula_frio_fermentador_1", "control": "automatico"},
        {"dispositivo": "electrovalvula_frio_fermentador_2", "control": "automatico"},
        {"dispositivo": "electrovalvula_frio_fermentador_3", "control": "automatico"},
        {"dispositivo": "electrovalvula_calor_fermentador_1", "control": "automatico"},
        {"dispositivo": "electrovalvula_calor_fermentador_2", "control": "automatico"},
        {"dispositivo": "electrovalvula_calor_fermentador_3", "control": "automatico"}
    ];

    for (var i = 0; i < mediciones.length; i++) {

        if (mediciones[i].sensor == "chiller") {
            var config_chiller = buscar_config("chiller", config);
            if (mediciones[i].temperatura >= config_chiller.temp_ideal + config_chiller.tolerancia) {
                accion_sobre_el_chiller = "encender";
                accion_de_la_bomba_del_chiller = "encender";
            } else if (mediciones[i].temperatura > config_chiller.temp_ideal && dispositivo_desde("chiller", dispositivos).estado == "encendido") {
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
            var config_fermentador = buscar_config(mediciones[i].sensor, config);
            var config_electrovalvula_frio = buscar_config("electrovalvula_frio_fermentador_" + nro_fermentador.toString(), config);

            if (mediciones[i].temperatura >= config_fermentador.temp_ideal + config_fermentador.tolerancia) {
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
            if (mediciones[i].temperatura < config_fermentador.temp_ideal - config_fermentador.tolerancia) {
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

    //sobreescritura en caso de establecerse manualmente los valores
    for (var i = 0; i < mediciones.length; i++) {
        if(mediciones[i].sensor.substring(0, "fermentador".length) == "fermentador" ) {
            var nro_fermentador = mediciones[i].sensor.substr(mediciones[i].sensor.length - 1, 1);
            var config_ev = buscar_config("electrovalvula_frio_fermentador_" + nro_fermentador.toString(), config);

            if(config_ev.control == "manual") {
                var acciones_sobre_ev = acciones.filter(function(each) {
                    return each.dispositivo == "electrovalvula_frio_fermentador_" + nro_fermentador.toString();
                });
                acciones_sobre_ev[0].accion = config_ev.accion;
            }
        }
    }

    var config_bomba_chiller =   buscar_config("bomba_chiller", config);
    if (config_bomba_chiller.control == "manual") {
        accion_de_la_bomba_del_chiller = config_bomba_chiller.accion;
    }

    var config_calentador = buscar_config("calentador", config);
    if (config_calentador.control == "manual") {
        accion_sobre_el_calentador = config_calentador.accion;
    }

    acciones.push({"dispositivo": "chiller", "accion": accion_sobre_el_chiller});
    dispositivo_desde("chiller", dispositivos).estado = accion_sobre_el_chiller;
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
