var expect  = require("chai").expect;
var mediciones = require("../app/mediciones");

/*
describe("comandos: ", function() {
    describe("cuando tomo el control manual de una electrovalvula", function() {
        describe("y la seteo cerrada", function() {
            beforeEach(function () {
                config = [{"dispositivo": "electrovalvula_frio_fermentador_1", "temp_ideal": 20, "tolerancia": 2, "control": "manual", "estado": "cerrada"}];
            });
            describe("si la temperatura de su fermentador sea alta", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 30}]);
                });

                it("deberia continuar cerrada", function() {
                    var electroValvula1Frio = acciones_sobre(acciones, "electrovalvula_frio_fermentador_1")[0];
                    expect(electroValvula1Frio.accion).to.equal("cerrar");
                });
            });
        });
    });
});*/