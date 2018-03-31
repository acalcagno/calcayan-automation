var config;

class Dispositivos {

    constructor(init) {
        config = init || [];
    }

    configurar(cfg) {
        config.push(cfg);
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