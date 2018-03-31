var config;


class Dispositivos {

    constructor(init) {
        config = init || [];
    }

    configurar(cfg) {
        config.push(cfg);
    }
}

exports.Dispositivos = Dispositivos;