var expect    = require("chai").expect;
var mediciones = require("../app/mediciones");

describe("mediciones", function() {
    describe("cuando el fermentador 1 esta caliente", function() {
        it("abre la electrovalvula de frio del fermentador 1", function() {
            var electroValvula1Frio = mediciones.nuevas_mediciones([30]);
            expect(electroValvula1Frio).to.equal("abierta");
        });
    });

    describe("cuando un fermentador esta frio", function() {
        it("cierra la electrovalvula de frio del fermentador 1", function() {
            var electroValvula1 = mediciones.nuevas_mediciones([5]);
            expect(electroValvula1).to.equal("cerrada");
        });
    });
});