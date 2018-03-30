var expect  = require("chai").expect;
var mediciones = require("../app/mediciones");

describe("con un comando: ", function() {
    describe("tomo el control manual de una electrovalvula", function() {
        describe("y la seteo cerrada", function() {
            beforeEach(function () {
                config = [{"dispositivo": "electrovalvula_frio_fermentador_1", "control": "manual", "accion": "cerrar"}];
                config.push({"dispositivo": "fermentador1", "temp_ideal": 20, "tolerancia":2});
                config.push({"dispositivo": "bomba_chiller", "control": "automatico"});
                config.push({"dispositivo": "calentador", "control": "automatico"});
            });
            describe("si la temperatura de su fermentador es alta", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 30}], config);
                });

                it("deberia continuar cerrada", function() {
                    var electroValvula1Frio = acciones_sobre(acciones, "electrovalvula_frio_fermentador_1")[0];
                    expect(electroValvula1Frio.accion).to.equal("cerrar");
                });
            });
            describe("si la temperatura de su fermentador es baja", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 5}], config);
                });

                it("deberia continuar cerrada", function() {
                    var electroValvula1Frio = acciones_sobre(acciones, "electrovalvula_frio_fermentador_1")[0];
                    expect(electroValvula1Frio.accion).to.equal("cerrar");
                });
            });
        });

        describe("y la seteo abierta", function() {
            beforeEach(function () {
                config = [{"dispositivo": "electrovalvula_frio_fermentador_1", "control": "manual", "accion": "abrir"}];
                config.push({"dispositivo": "fermentador1", "temp_ideal": 20, "tolerancia":2});
                config.push({"dispositivo": "bomba_chiller", "control": "automatico"});
                config.push({"dispositivo": "calentador", "control": "automatico"});
            });
            describe("si la temperatura de su fermentador es alta", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 30}], config);
                });

                it("deberia continuar abierta", function() {
                    var electroValvula1Frio = acciones_sobre(acciones, "electrovalvula_frio_fermentador_1")[0];
                    expect(electroValvula1Frio.accion).to.equal("abrir");
                });
            });
            describe("si la temperatura de su fermentador es baja", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 5}], config);
                });

                it("deberia continuar abierta", function() {
                    var electroValvula1Frio = acciones_sobre(acciones, "electrovalvula_frio_fermentador_1")[0];
                    expect(electroValvula1Frio.accion).to.equal("abrir");
                });
            });
        });
    });
    describe("tomo el control manual del calentador", function() {
        beforeEach(function () {
            config = [];
            config.push({"dispositivo":"bomba_chiller", "control": "automatico"});
            config.push({"dispositivo":"calentador", "temp_ideal": 30, "tolerancia":5, "control":"manual"});

        });
        describe("y lo seteo encendido", function() {
            beforeEach(function () {
                buscar_config("calentador", config).accion = "encender";
            });
            describe("si esta caliente", function() {
                beforeEach(function () {
                    medidas = [{"sensor":"calentador", "temperatura": 40}];
                    acciones = mediciones.nuevas_mediciones(medidas, config);
                });
                it("se mantiene encendido", function() {
                    var accion_calentador = acciones_sobre(acciones, "calentador")[0];
                    expect(accion_calentador.accion).to.equal("encender");
                });
            });
            describe("si esta frio", function() {
                beforeEach(function () {
                    medidas = [{"sensor":"calentador", "temperatura": 5}];
                    acciones = mediciones.nuevas_mediciones(medidas, config);
                });
                it("se mantiene encendido", function() {
                    var accion_calentador = acciones_sobre(acciones, "calentador")[0];
                    expect(accion_calentador.accion).to.equal("encender");
                });
            });
        });
        describe("y lo seteo apagado", function() {
            beforeEach(function () {
                buscar_config("calentador", config).accion = "apagar";
            });
            describe("si esta caliente", function() {
                beforeEach(function () {
                    medidas = [{"sensor":"calentador", "temperatura": 40}];
                    acciones = mediciones.nuevas_mediciones(medidas, config);
                });

                it("se mantiene apagado", function() {
                    var accion_calentador = acciones_sobre(acciones, "calentador")[0];
                    expect(accion_calentador.accion).to.equal("apagar");
                });
            });
            describe("si esta frio", function() {
                beforeEach(function () {
                    medidas = [{"sensor":"calentador", "temperatura": 5}];
                    acciones = mediciones.nuevas_mediciones(medidas, config);
                });
                it("se mantiene apagado", function() {
                    var accion_calentador = acciones_sobre(acciones, "calentador")[0];
                    expect(accion_calentador.accion).to.equal("apagar");
                });
            });
        })
    });
    describe("tomo el control manual de la bomba del chiller", function() {
        describe("y la seteo encendida", function() {
            beforeEach(function () {
                config = [{"dispositivo": "electrovalvula_frio_fermentador_1", "control": "automatico"}];
                config.push({"dispositivo": "bomba_chiller", "control": "manual", "accion": "encender"});
                config.push({"dispositivo": "fermentador1", "temp_ideal": 20, "tolerancia":2});
                config.push({"dispositivo": "calentador", "control": "automatico"});
            });
            describe("si la temperatura de un fermentador es alta", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 30}], config);
                });

                it("deberia estar encendida", function() {
                    var bomba_chiller = acciones_sobre(acciones, "bomba_chiller")[0];
                    expect(bomba_chiller.accion).to.equal("encender");
                });
            });
            describe("si la temperatura de un fermentador es baja", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 5}], config);
                });

                it("deberia estar encendida", function() {
                    var bomba_chiller = acciones_sobre(acciones, "bomba_chiller")[0];
                    expect(bomba_chiller.accion).to.equal("encender");
                });
            });
        });
        describe("y la seteo apagada", function() {
            beforeEach(function () {
                config = [{"dispositivo": "electrovalvula_frio_fermentador_1", "control": "automatico"}];
                config.push({"dispositivo": "bomba_chiller", "control": "manual", "accion": "apagar"});
                config.push({"dispositivo": "fermentador1", "temp_ideal": 20, "tolerancia":2});
                config.push({"dispositivo": "calentador", "control": "automatico"});
            });
            describe("si la temperatura de un fermentador es alta", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 30}], config);
                });

                it("deberia estar apagada", function() {
                    var bomba_chiller = acciones_sobre(acciones, "bomba_chiller")[0];
                    expect(bomba_chiller.accion).to.equal("apagar");
                });
            });
        });
    });
});

acciones_sobre = function(acciones, nombre_dispositivo) {
    var acciones_sobre_dispositivo = acciones.filter(function(accion) {
        var len = nombre_dispositivo.length;
        return accion.dispositivo.substring(0,len) == nombre_dispositivo;
    });
    return acciones_sobre_dispositivo;
}