var expect  = require("chai").expect;
var mediciones = require("../app/mediciones");
var dispos_module = require("../app/dispositivos");

var dispos;

describe("con un comando: ", function() {
    describe("tomo el control manual de una electrovalvula", function() {
        describe("y la seteo cerrada", function() {
            beforeEach(function () {
                dispos = new dispos_module.Dispositivos([{"dispositivo": "electrovalvula_frio_fermentador_1", "control": "manual", "accion": "cerrar"}]);
                dispos.configurar({"dispositivo": "fermentador1", "temp_ideal": 20, "tolerancia":2});
                dispos.configurar({"dispositivo": "bomba_chiller", "control": "automatico"});
                dispos.configurar({"dispositivo": "calentador", "control": "automatico"});
                dispos.configurar({"dispositivo": "chiller", "control": "automatico"});
            });
            describe("si la temperatura de su fermentador es alta", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 30}], dispos);
                });

                it("deberia continuar cerrada", function() {
                    var electroValvula1Frio = acciones_sobre(acciones, "electrovalvula_frio_fermentador_1")[0];
                    expect(electroValvula1Frio.accion).to.equal("cerrar");
                });
            });
            describe("si la temperatura de su fermentador es baja", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 5}], dispos);
                });

                it("deberia continuar cerrada", function() {
                    var electroValvula1Frio = acciones_sobre(acciones, "electrovalvula_frio_fermentador_1")[0];
                    expect(electroValvula1Frio.accion).to.equal("cerrar");
                });
            });
        });

        describe("y la seteo abierta", function() {
            beforeEach(function () {
                dispos = new dispos_module.Dispositivos([{"dispositivo": "electrovalvula_frio_fermentador_1", "control": "manual", "accion": "abrir"}]);
                dispos.configurar({"dispositivo": "fermentador1", "temp_ideal": 20, "tolerancia":2});
                dispos.configurar({"dispositivo": "bomba_chiller", "control": "automatico"});
                dispos.configurar({"dispositivo": "calentador", "control": "automatico"});
                dispos.configurar({"dispositivo": "chiller", "control": "automatico"});
            });
            describe("si la temperatura de su fermentador es alta", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 30}], dispos);
                });

                it("deberia continuar abierta", function() {
                    var electroValvula1Frio = acciones_sobre(acciones, "electrovalvula_frio_fermentador_1")[0];
                    expect(electroValvula1Frio.accion).to.equal("abrir");
                });
            });
            describe("si la temperatura de su fermentador es baja", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 5}], dispos);
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
            dispos = new dispos_module.Dispositivos()
            dispos.configurar({"dispositivo":"bomba_chiller", "control": "automatico"});
            dispos.configurar({"dispositivo":"calentador", "temp_ideal": 30, "tolerancia":5, "control":"manual"});
            dispos.configurar({"dispositivo": "chiller", "control": "automatico"});

        });
        describe("y lo seteo encendido", function() {
            beforeEach(function () {
                dispos.buscar_config("calentador").accion = "encender";
            });
            describe("si esta caliente", function() {
                beforeEach(function () {
                    medidas = [{"sensor":"calentador", "temperatura": 40}];
                    acciones = mediciones.nuevas_mediciones(medidas, dispos);
                });
                it("se mantiene encendido", function() {
                    var accion_calentador = acciones_sobre(acciones, "calentador")[0];
                    expect(accion_calentador.accion).to.equal("encender");
                });
            });
            describe("si esta frio", function() {
                beforeEach(function () {
                    medidas = [{"sensor":"calentador", "temperatura": 5}];
                    acciones = mediciones.nuevas_mediciones(medidas, dispos);
                });
                it("se mantiene encendido", function() {
                    var accion_calentador = acciones_sobre(acciones, "calentador")[0];
                    expect(accion_calentador.accion).to.equal("encender");
                });
            });
        });
        describe("y lo seteo apagado", function() {
            beforeEach(function () {
                dispos.buscar_config("calentador").accion = "apagar";
            });
            describe("si esta caliente", function() {
                beforeEach(function () {
                    medidas = [{"sensor":"calentador", "temperatura": 40}];
                    acciones = mediciones.nuevas_mediciones(medidas, dispos);
                });

                it("se mantiene apagado", function() {
                    var accion_calentador = acciones_sobre(acciones, "calentador")[0];
                    expect(accion_calentador.accion).to.equal("apagar");
                });
            });
            describe("si esta frio", function() {
                beforeEach(function () {
                    medidas = [{"sensor":"calentador", "temperatura": 5}];
                    acciones = mediciones.nuevas_mediciones(medidas, dispos);
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
                dispos = new dispos_module.Dispositivos([{"dispositivo": "electrovalvula_frio_fermentador_1", "control": "automatico"}]);
                dispos.configurar({"dispositivo": "bomba_chiller", "control": "manual", "accion": "encender"});
                dispos.configurar({"dispositivo": "fermentador1", "temp_ideal": 20, "tolerancia":2});
                dispos.configurar({"dispositivo": "calentador", "control": "automatico"});
                dispos.configurar({"dispositivo": "chiller", "control": "automatico"});
            });
            describe("si la temperatura de un fermentador es alta", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 30}], dispos);
                });

                it("deberia estar encendida", function() {
                    var bomba_chiller = acciones_sobre(acciones, "bomba_chiller")[0];
                    expect(bomba_chiller.accion).to.equal("encender");
                });
            });
            describe("si la temperatura de un fermentador es baja", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 5}], dispos);
                });

                it("deberia estar encendida", function() {
                    var bomba_chiller = acciones_sobre(acciones, "bomba_chiller")[0];
                    expect(bomba_chiller.accion).to.equal("encender");
                });
            });
        });
        describe("y la seteo apagada", function() {
            beforeEach(function () {
                dispos = new dispos_module.Dispositivos([{"dispositivo": "electrovalvula_frio_fermentador_1", "control": "automatico"}]);
                dispos.configurar({"dispositivo": "bomba_chiller", "control": "manual", "accion": "apagar"});
                dispos.configurar({"dispositivo": "fermentador1", "temp_ideal": 20, "tolerancia":2});
                dispos.configurar({"dispositivo": "calentador", "control": "automatico"});
                dispos.configurar({"dispositivo": "chiller", "control": "automatico"});
            });
            describe("si la temperatura de un fermentador es alta", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 30}], dispos);
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