class Actuador {


    constructor(nombre, funcion_activacion) {
        this.nombre = nombre;
        this.funcion_activacion = funcion_activacion;
    }

    get_accion_encender() {
        return {"dispositivo": this.nombre, "accion": this.funcion_activacion()};
    }

    toString() { return "Actuador: " + this.nombre; }
}

exports.Actuador = Actuador;