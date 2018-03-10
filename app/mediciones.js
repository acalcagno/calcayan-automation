exports.nuevas_mediciones = function(mediciones) {
    if (mediciones[0] >= 19) {
        return "abierta";
    } else {
        return "cerrada"
    }

};

