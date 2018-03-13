var expect  = require("chai").expect;
var mediciones = require("../app/mediciones");

describe("mediciones: ", function() {
    var acciones;

    describe("cuando el calentador frio", function() {
        beforeEach(function () {
            acciones = mediciones.nuevas_mediciones([{"sensor":"calentador", "temperatura": "10"}]);
        });

        it("debería encenderse", function() {
            var accion_chiller = acciones_sobre(acciones, "calentador")[0];
            expect(accion_chiller.accion).to.equal("encender");
        });
    })

    describe("cuando el calentador esta a temperatura deseada", function() {
        beforeEach(function () {
            acciones = mediciones.nuevas_mediciones([{"sensor":"calentador", "temperatura": "45"}]);
        });

        it("debería apagarse", function() {
            var accion_chiller = acciones_sobre(acciones, "calentador")[0];
            expect(accion_chiller.accion).to.equal("apagar");
        });
    })

    describe("cuando el chiller esta en temperatura deseada", function() {
        beforeEach(function () {
            acciones = mediciones.nuevas_mediciones([{"sensor":"chiller", "temperatura": "-5"}]);
        });

        it("debería apagarse", function() {
            var accion_chiller = acciones_sobre(acciones, "chiller")[0];
            expect(accion_chiller.accion).to.equal("apagar");
        });
    })

    describe("cuando el chiller esta caliente", function() {
        beforeEach(function () {
            acciones = mediciones.nuevas_mediciones([{"sensor":"chiller", "temperatura": "25"}]);
        });

        it("debería encenderse", function() {
            var accion_chiller = acciones_sobre(acciones, "chiller")[0];
            expect(accion_chiller.accion).to.equal("encender");
        });
        it("debería la bomba_chiller", function() {
            var accion_chiller = acciones_sobre(acciones, "bomba_chiller")[0];
            expect(accion_chiller.accion).to.equal("encender");
        });
    })

    describe("cuando hay un solo fermentador", function() {
        beforeEach(function () {
            acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": "30"}]);
        });

        describe("y esta caliente", function () {
            it("abre la electrovalvula de frio", function () {
                var electroValvula1Frio = acciones_sobre(acciones, "electrovalvula_frio_fermentador_1")[0];
                expect(electroValvula1Frio.accion).to.equal("abrir");
            });

            it("cierra la electrovalvula de calor", function () {
                var electroValvula1Calor = acciones_sobre(acciones, "electrovalvula_calor_fermentador_1")[0];
                expect(electroValvula1Calor.accion).to.equal("cerrar");
            });

            it("enciende la bomba", function () {
                var bomba = acciones_sobre(acciones, "bomba_chiller")[0];
                expect(bomba.accion).to.equal("encender");
            });
        });

        describe("y esta en temperatura deseada", function () {
            beforeEach(function () {
                acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": "20"}]);
            });
            it("cierra la electrovalvula de frio", function () {
                var electroValvula1 = acciones_sobre(acciones, "electrovalvula_frio_fermentador_1")[0];
                expect(electroValvula1.accion).to.equal("cerrar");
            });
            it("apaga la bomba", function () {
                var bomba = acciones_sobre(acciones, "bomba_chiller")[0];
                expect(bomba.accion).to.equal("apagar");
            });
        });

        it("identifica claramente a las acciones sobre las electrovalvulas", function() {
            expect(acciones[0].dispositivo).to.equal("electrovalvula_frio_fermentador_1");
            expect(acciones[1].dispositivo).to.equal("electrovalvula_calor_fermentador_1");
        });

        it("identifica claramente a la accion sobre el chiller", function() {
            expect(acciones[2].dispositivo).to.equal("chiller");
        });

        it("identifica claramente a la accion sobre la bomba del chiller", function() {
            expect(acciones[3].dispositivo).to.equal("bomba_chiller");
        });

        it("identifica claramente a la accion sobre el calentador", function() {
            expect(acciones[4].dispositivo).to.equal("calentador");
        });

        it("identifica claramente a la accion sobre la bomba del calentador", function() {
            expect(acciones[5].dispositivo).to.equal("bomba_calentador");
        });
    });

    describe("cuando hay N fermentadores", function() {
        var medidas;
        var n;
        var desordenador = 3; //variable para emular parametros en un mal orden
        beforeEach(function () {
            medidas = [];
            n = 7;

            for (var i=desordenador; i < n+desordenador; i++) {
                medidas.push({"sensor": "fermentador" + n.toString(), "temperatura": "18"});
            }
            acciones = mediciones.nuevas_mediciones(medidas);
        });

        it("deberia devolver acciones para N electrovalvulas de frio" , function() {
            var acciones_sobre_electrovalvulas = acciones_sobre(acciones, "electrovalvula_frio");
            expect(acciones_sobre_electrovalvulas.length).to.equal(n);
        });

        it("deberia devolver acciones para N electrovalvulas de calor" , function() {
            var acciones_sobre_electrovalvulas = acciones_sobre(acciones, "electrovalvula_calor");
            expect(acciones_sobre_electrovalvulas.length).to.equal(n);
        });

        it("deberia devolver una accion para el chiller", function() {
            var acciones_sobre_chiller = acciones_sobre(acciones, "chiller");
            expect(acciones_sobre_chiller.length).to.equal(1);
        });

        it("deberia devolver una accion para la bomba_chiller", function() {
            var acciones_sobre_chiller = acciones_sobre(acciones, "bomba_chiller");
            expect(acciones_sobre_chiller.length).to.equal(1);
        });

        it("deberia devolver una accion del calentador", function() {
            var acciones_sobre_chiller = acciones_sobre(acciones, "calentador");
            expect(acciones_sobre_chiller.length).to.equal(1);
        });

        describe("y estan todos en temperatura deseada", function(){
            it("deberia apagar la bomba", function() {
                var accion_sobre_bomba = acciones_sobre(acciones, "bomba_chiller")[0];
                expect(accion_sobre_bomba.accion).to.equal("apagar");
            })
        });

        describe("y hay alguno caliente", function(){
            beforeEach(function () {
                medidas[2].temperatura = 30;
                acciones = mediciones.nuevas_mediciones(medidas);
            });
            it("deberia encender la bomba", function() {
                var accion_sobre_bomba = acciones_sobre(acciones, "bomba_chiller")[0];
                expect(accion_sobre_bomba.accion).to.equal("encender");
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