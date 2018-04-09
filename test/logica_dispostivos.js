var expect  = require("chai").expect;
var Actuador = require("../app/Actuador").Actuador;
var Fermentador = require("../app/Fermentador").Fermentador;

describe("Un Fermentador: ", function() {
    var ev1;
    var ev2;
    var bomba_chiller;
    var dispositivos_enfriado;

    describe("con dispositivos de enfriado [bomba_chiller, ev1]", function() {
        beforeEach(function () {
            ev1 = new Actuador("electrovalvula_frio_fermentador_1", () => { return "abrir"; });
            bomba_chiller = new Actuador("bomba_chiller", () => { return "encender"; });
            dispositivos_enfriado = [ev1, bomba_chiller];
        });

        it("deberia activar ambos si está caliente", function () {
            var fermentador = new Fermentador("fermentador1",{"temp_ideal": 20, "tolerancia": 2}, dispositivos_enfriado);
            var acciones = fermentador.mediciones([{"sensor": "fermentador1", "temperatura": 30}]);

            expect(acciones.length).to.equal(2);
            expect(acciones).to.be.an('array').that.include({
                "dispositivo": "electrovalvula_frio_fermentador_1",
                "accion": "abrir"
            });
            expect(acciones).to.be.an('array').that.include({"dispositivo": "bomba_chiller", "accion": "encender"});

        });

        describe("con dispositivos de enfriado [bomba_chiller, ev2]", function () {
            beforeEach(function () {
                ev1 = new Actuador("electrovalvula_frio_fermentador_2", () => { return "abrir"; });
                bomba_chiller = new Actuador("bomba_chiller", () => { return "encender"; });
                dispositivos_enfriado = [ev1, bomba_chiller];
            });

            it("deberia activar ambos si está caliente", function () {
                var fermentador = new Fermentador("fermentador1", {"temp_ideal": 20, "tolerancia": 2}, dispositivos_enfriado);
                var acciones = fermentador.mediciones([{"sensor": "fermentador1", "temperatura": 30}], acciones);

                expect(acciones.length).to.equal(2);
                expect(acciones).to.be.an('array').that.include({
                    "dispositivo": "electrovalvula_frio_fermentador_2",
                    "accion": "abrir"
                });
                expect(acciones).to.be.an('array').that.include({"dispositivo": "bomba_chiller", "accion": "encender"});
            });
        });
    });
});