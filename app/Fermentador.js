
class Fermentador {

    constructor(nombre, configuracion, dispositivos_enfriado) {
        this.nombre_fermentador = nombre;
        this.dispositivos_enfriado = dispositivos_enfriado;
    }

    mediciones(med) {
        var acciones = [];
        this.dispositivos_enfriado.forEach(i => {
            acciones.push(i.get_accion_encender());
        });
        return acciones;
        //return [{"dispositivo":"electrovalvula_frio_fermentador_1", "accion": "abrir"}, {"dispositivo":"bomba_chiller", "accion": "encender"}];
    }
}

exports.Fermentador = Fermentador;