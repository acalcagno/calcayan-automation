exports.nuevas_mediciones = function(mediciones) {
    if (mediciones[0].temperatura >= 21) {
        return [{"dispositivo": "electrovalvula_1","estado":"abierta"}, {"dispositivo": "bomba","estado":"encendida"}];
    } else {
        return [{"dispositivo": "electrovalvula_1","estado":"cerrada"}, {"dispositivo": "bomba","estado":"apagada"}];
    }
};

