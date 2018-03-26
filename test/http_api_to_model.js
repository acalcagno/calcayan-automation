var expect  = require("chai").expect;
var mediciones = require("../app/mediciones");
var http_api_to_model = require("../app/http_api_to_model");


describe("http_api_to_model: ", function() {


    var respuesta_model = {
        "acciones_a_realizar": [
            {
                "dispositivo": "electrovalvula_frio_fermentador_1",
                "accion": "cerrar"
            },
            {
                "dispositivo": "electrovalvula_calor_fermentador_1",
                "accion": "abrir"
            },
            {
                "dispositivo": "electrovalvula_frio_fermentador_2",
                "accion": "cerrar"
            },
            {
                "dispositivo": "electrovalvula_calor_fermentador_2",
                "accion": "abrir"
            },
            {
                "dispositivo": "electrovalvula_frio_fermentador_3",
                "accion": "cerrar"
            },
            {
                "dispositivo": "electrovalvula_calor_fermentador_3",
                "accion": "abrir"
            },
            {
                "dispositivo": "chiller",
                "accion": "apagar"
            },
            {
                "dispositivo": "bomba_chiller",
                "accion": "apagar"
            },
            {
                "dispositivo": "calentador",
                "accion": "encender"
            },
            {
                "dispositivo": "bomba_calentador",
                "accion": "encender"
            }
        ]
    };

    describe("un response", function () {
        it("deberia tener un 0 en lugar de un cerrar", function () {
            var respuesta_api = http_api_to_model.get_api_response(respuesta_model);
            expect(respuesta_api.acciones_a_realizar[0].accion).to.equal(0);
        });

        it("deberia tener un 1 en lugar de un abrir", function () {
            var respuesta_api = http_api_to_model.get_api_response(respuesta_model);
            expect(respuesta_api.acciones_a_realizar[1].accion).to.equal(1);
        });

        it("deberia tener un 1 en lugar de un encender", function () {
            var respuesta_api = http_api_to_model.get_api_response(respuesta_model);
            expect(respuesta_api.acciones_a_realizar[9].accion).to.equal(1);
        });

        it("deberia tener un 0 en lugar de un apagar", function () {
            var respuesta_api = http_api_to_model.get_api_response(respuesta_model);
            expect(respuesta_api.acciones_a_realizar[7].accion).to.equal(0);
        });
    });
});