class Actuador {


    constructor(nombre, funcion_activacion) {
        this.nombre = nombre;
        this.funcion_activacion = funcion_activacion;
    }

    get_accion_encender() {
        return {"dispositivo": this.nombre, "accion": this.funcion_activacion()};
    }

    accionar_sobre(coleccion_de_acciones) {
        coleccion_de_acciones.push(this.get_accion_encender())
    }

    toString() { return "Actuador: " + this.nombre; }
}

exports.Actuador = Actuador;