var config;

class Dispositivos {

    constructor(init) {
        config = init || [];
    }

    configurar(cfg) {
        if (this.buscar_config(cfg.dispositivo) == undefined) {
            config.push(cfg);
        } else {
            throw ("el dispositivo " + cfg.dispositivo + " ya fue configurado y se está queriendo configurar otra vez.");
        }
    }

    configurar_attr(dispositivo, attr, valor) {
        var cfg_dispo = this.buscar_config(dispositivo);
        if (cfg_dispo == undefined) throw ("se quiso establecer la configuracion de un dispositivo que aún no figura en la lista de dispositivos")
        cfg_dispo[attr] = valor;
    }

    buscar_config(key) {
        var result = config.filter(function(each) {
            var len = key.length;
            return each.dispositivo.substring(0,len) == key;
        });
        return result[0];
    }
}

exports.Dispositivos = Dispositivos;