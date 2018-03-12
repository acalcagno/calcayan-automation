var expect    = require("chai").expect;
var mediciones = require("../app/mediciones");

describe("mediciones: ", function() {
    var acciones;
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

        describe("y esta en temperatura", function () {
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
});