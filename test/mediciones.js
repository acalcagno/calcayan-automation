var expect  = require("chai").expect;
var mediciones = require("../app/mediciones");

describe("mediciones: ", function() {
    var acciones;

    describe("cuando el chiller esta en temperatura deseada", function() {
        beforeEach(function () {
            acciones = mediciones.nuevas_mediciones([{"sensor":"chiller", "temperatura": "-5"}]);
        });

        it("el chiller debería estar apagado", function() {
            var accion_chiller = acciones_sobre(acciones, "chiller")[0];
            expect(accion_chiller.estado).to.equal("apagado");
        })
    })

    describe("cuando hay un solo fermentador", function() {
        beforeEach(function () {
            acciones = mediciones.nuevas_mediciones([{"temperatura": "30"}]);
        });

        describe("y esta caliente", function () {
            it("abre la electrovalvula de frio", function () {
                var electroValvula1Frio = acciones[0];
                expect(electroValvula1Frio.estado).to.equal("abierta");
            });

            it("enciende la bomba", function () {
                var bomba = acciones[1];
                expect(bomba.estado).to.equal("encendida");
            });
        });

        describe("y esta en temperatura deseada", function () {
            beforeEach(function () {
                acciones = mediciones.nuevas_mediciones([{"temperatura": "20"}]);
            });
            it("cierra la electrovalvula de frio", function () {
                var electroValvula1 = acciones[0];
                expect(electroValvula1.estado).to.equal("cerrada");
            });
            it("apaga la bomba", function () {
                var bomba = acciones[1];
                expect(bomba.estado).to.equal("apagada");
            });
        });

        it("identifica claramente a la electrovalvula y a la bomba", function() {
            expect(acciones[0].dispositivo).to.equal("electrovalvula_1");
            expect(acciones[1].dispositivo).to.equal("bomba");
        });
    });
    describe("cuando hay N fermentadores", function() {
        var medidas;
        var n;
        beforeEach(function () {
            medidas = [];
            n = 7;
            for (var i=0; i < n; i++) {
                medidas.push({"nro_sensor_fermentador": n, "temperatura": "18"});
            }
            acciones = mediciones.nuevas_mediciones(medidas);
        });
        it("deberia devolver acciones para N electrovalvulas" , function() {
            var acciones_sobre_electrovalvulas = acciones_sobre(acciones, "electrovalvula");
            expect(acciones_sobre_electrovalvulas.length).to.equal(n);
        });
        describe("y estan todos en temperatura deseada", function(){
            it("deberia estar la bomba apagada", function() {
                var accion_sobre_bomba = acciones_sobre(acciones, "bomba")[0];
                expect(accion_sobre_bomba.estado).to.equal("apagada");
            })
        });

        describe("y hay alguno caliente", function(){
            beforeEach(function () {
                medidas[2].temperatura = 30;
                acciones = mediciones.nuevas_mediciones(medidas);
            });
            it("deberia estar la bomba prendida", function() {
                var accion_sobre_bomba = acciones_sobre(acciones, "bomba")[0];
                expect(accion_sobre_bomba.estado).to.equal("encendida");
            })
        });
    });

    acciones_sobre = function(acciones, nombre_dispositivo) {
        var acciones_sobre_dispositivo = acciones.filter(function(accion) {
            var len = nombre_dispositivo.length;
            return accion.dispositivo.substring(0,len) == nombre_dispositivo;
        });
        return acciones_sobre_dispositivo;
    }
});