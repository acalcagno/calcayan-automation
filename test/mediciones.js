var expect  = require("chai").expect;
var mediciones = require("../app/mediciones");


describe("mediciones: ", function() {
    var acciones;
    var medidas;
    var config;
    var dispositivos;

    describe("el calentador" , function() {
        describe("cuando esta configurado a 30 con tolerancia -5 grados", function()  {
            beforeEach(function () {
                config = [{"dispositivo":"calentador", "temp_ideal": 30, "tolerancia":5}];
                config.push({"dispositivo":"bomba_chiller", "control": "automatico"});
            });
            describe("y esta frio (se miden 10 grados)", function() {
                beforeEach(function () {
                    medidas = [{"sensor":"calentador", "temperatura": 10}];
                    acciones = mediciones.nuevas_mediciones(medidas, config);
                });

                it("debería encenderse", function() {
                    var accion_calentador = acciones_sobre(acciones, "calentador")[0];
                    expect(accion_calentador.accion).to.equal("encender");
                });
            });

            describe("y esta caliente (se miden 45)", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"calentador", "temperatura": 45}], config);
                });

                it("debería apagarse", function() {
                    var accion_calentador = acciones_sobre(acciones, "calentador")[0];
                    expect(accion_calentador.accion).to.equal("apagar");
                });
            });

            describe("y esta en el rango permitido (se miden 28 grados)", function() {
                describe("si estaba encendido", function() {
                    beforeEach(function () {
                        var dispositivos = [ {"dispositivo":"calentador", "estado": "encendido"} ];
                        acciones = mediciones.nuevas_mediciones([{"sensor":"calentador", "temperatura": 28}], config, dispositivos);
                    });
                    it("debería continuar encendido", function() {
                        var accion_calentador = acciones_sobre(acciones, "calentador")[0];
                        expect(accion_calentador.accion).to.equal("encender");
                    })
                });

                describe("si estaba apagado", function() {
                    beforeEach(function () {
                        var dispositivos = [ {"dispositivo":"calentador", "estado": "apagado"} ];
                        acciones = mediciones.nuevas_mediciones([{"sensor":"calentador", "temperatura": 28}], config, dispositivos);
                    });
                    it("debería continuar apagado", function() {
                        var accion_calentador = acciones_sobre(acciones, "calentador")[0];
                        expect(accion_calentador.accion).to.equal("apagar");
                    })
                });

                describe("si ya estuvo encendido, y luego se apago", function() {
                    var dispositivos;
                    beforeEach(function () {
                        dispositivos = [ {"dispositivo":"calentador", "estado": "encendido"} ]; //estaba encendido
                        acciones = mediciones.nuevas_mediciones([{"sensor":"calentador", "temperatura": 35}], config, dispositivos);
                    });
                    it("debería continuar apagado", function() {
                        var accion_calentador = acciones_sobre(acciones, "calentador")[0];
                        expect(accion_calentador.accion).to.equal("apagar"); //y luego se apago

                        acciones = mediciones.nuevas_mediciones([{"sensor":"calentador", "temperatura": 28}], config, dispositivos);
                        var accion_calentador = acciones_sobre(acciones, "calentador")[0];
                        expect(accion_calentador.accion).to.equal("apagar");
                    })
                });
            });
        })

        describe("cuando esta configurado a 50 con tolerancia - 5 grados", function()  {
            beforeEach(function () {
                config = [{"dispositivo":"calentador", "temp_ideal": "50", "tolerancia":5}];
                config.push({"dispositivo":"bomba_chiller", "control": "automatico"});
            });
            describe("y esta frio (se miden 42 grados)", function() {
                beforeEach(function () {
                    medidas = [{"sensor":"calentador", "temperatura": 42}];
                    acciones = mediciones.nuevas_mediciones(medidas, config);
                });

                it("debería encenderse", function() {
                    var accion_chiller = acciones_sobre(acciones, "calentador")[0];
                    expect(accion_chiller.accion).to.equal("encender");
                });
            })

            describe("y esta caliente (se miden 60)", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"calentador", "temperatura": 60}], config, dispositivos);
                });

                it("debería apagarse", function() {
                    var accion_chiller = acciones_sobre(acciones, "calentador")[0];
                    expect(accion_chiller.accion).to.equal("apagar");
                });
            });
        });
    });

    describe("el chiller", function() {
        describe("cuando esta configurado a -10 grados, con tolerancia de 3 grados", function  () {
            beforeEach(function () {
                config = [{"dispositivo":"chiller", "temp_ideal": -10, "tolerancia":3}];
                config.push({"dispositivo":"bomba_chiller", "control": "automatico"});
            });
            describe("si está a temperatura deseada (se miden -10)", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"chiller", "temperatura": -10}], config, dispositivos);
                });

                it("debería apagarse", function() {
                    var accion_chiller = acciones_sobre(acciones, "chiller")[0];
                    expect(accion_chiller.accion).to.equal("apagar");
                });
            });

            describe("si esta caliente (se miden -5)", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"chiller", "temperatura": -5}], config, dispositivos);
                });

                it("debería encenderse", function() {
                    var accion_chiller = acciones_sobre(acciones, "chiller")[0];
                    expect(accion_chiller.accion).to.equal("encender");
                });

                it("debería encender la bomba_chiller", function() {
                    var accion_chiller = acciones_sobre(acciones, "bomba_chiller")[0];
                    expect(accion_chiller.accion).to.equal("encender");
                });
            });

            describe("si esta en el rango permitido (se miden -9)", function() {
                describe("y estaba encendido", function() {
                    beforeEach(function () {
                        var dispositivos = [ {"dispositivo":"chiller", "estado": "encendido"} ];
                        acciones = mediciones.nuevas_mediciones([{"sensor":"chiller", "temperatura": -9}], config, dispositivos);
                    });

                    it("deberia seguir encendido", function() {
                        var accion_chiller = acciones_sobre(acciones, "chiller")[0];
                        expect(accion_chiller.accion).to.equal("encender");
                    });

                    it("deberia seguir encendida la bomba del chiller", function() {
                        var accion_chiller = acciones_sobre(acciones, "bomba_chiller")[0];
                        expect(accion_chiller.accion).to.equal("encender");
                    });
                });

                describe("y estaba apagado", function() {
                    beforeEach(function () {
                        var dispositivos = [ {"dispositivo":"chiller", "estado": "apagado"} ];
                        acciones = mediciones.nuevas_mediciones([{"sensor":"chiller", "temperatura": -9}], config, dispositivos);
                    });
                    it("deberia seguir apagado", function() {
                        var accion_chiller = acciones_sobre(acciones, "chiller")[0];
                        expect(accion_chiller.accion).to.equal("apagar");
                    });
                });

                describe("si ya estuvo encendido, y luego se apago", function() {
                    var dispositivos;
                    beforeEach(function () {
                        dispositivos = [ {"dispositivo":"chiller", "estado": "encendido"} ]; //estaba encendido
                        acciones = mediciones.nuevas_mediciones([{"sensor":"chiller", "temperatura": -10}], config, dispositivos);
                    });
                    it("debería continuar apagado", function() {
                        var accion_chiller = acciones_sobre(acciones, "chiller")[0];
                        expect(accion_chiller.accion).to.equal("apagar"); //y luego se apago

                        acciones = mediciones.nuevas_mediciones([{"sensor":"chiller", "temperatura": -9}], config, dispositivos);
                        var accion_chiller = acciones_sobre(acciones, "chiller")[0];
                        expect(accion_chiller.accion).to.equal("apagar");
                    })
                });
            });
            /*describe("cuando se configura para descansar 5 minutos luego de trabajar 20 minutos", function() {
                beforeEach(function () {
                    config = [{"dispositivo":"chiller", "temp_ideal": -10, "tolerancia":5, "tiempo_maximo_funcionamiento_continuo":20, "tiempo_reposicion_por_funcionamiento_continuo":5}];
                    dispositivos = [ {"dispositivo":"chiller", "estado": "encendido"} ]; //estaba encendido
                    acciones = mediciones.nuevas_mediciones([{"sensor":"chiller", "temperatura": 2, "hora_actual": new Date().getTime() - 20*60 }], config, dispositivos); //medida tomada hace 20 minutos;
                });
                it("se apaga luego de funcionar ininterrumpidamente durante ese tiempo", function() {
                    var accion_chiller = acciones_sobre(acciones, "chiller")[0];

                    acciones = mediciones.nuevas_mediciones([{"sensor":"chiller", "temperatura": 2, "hora_actual": new Date().getTime() }], config, dispositivos); //medida tomada hace 20 minutos;

                    expect(accion_chiller.accion).to.equal("apagar");
                });
            });*/
        });
        describe("cuando esta configurado a 15 grados, con tolerancia de 5 grados", function  () {
            beforeEach(function () {
                config = [{"dispositivo": "chiller", "temp_ideal": 15, "tolerancia": 5}];
                config.push({"dispositivo":"bomba_chiller", "control": "automatico"});
            });
            describe("si está a temperatura deseada (se miden 15)", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"chiller", "temperatura": 15}], config, dispositivos);
                });

                it("debería apagarse", function() {
                    var accion_chiller = acciones_sobre(acciones, "chiller")[0];
                    expect(accion_chiller.accion).to.equal("apagar");
                });
            });

            describe("si esta caliente (se miden 21)", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"chiller", "temperatura": 21}], config, dispositivos);
                });

                it("debería encenderse", function() {
                    var accion_chiller = acciones_sobre(acciones, "chiller")[0];
                    expect(accion_chiller.accion).to.equal("encender");
                });

                it("debería encender la bomba_chiller", function() {
                    var accion_chiller = acciones_sobre(acciones, "bomba_chiller")[0];
                    expect(accion_chiller.accion).to.equal("encender");
                });
            });
        });
    });

    describe("cuando hay un solo fermentador", function() {
        describe("configurado para fermentacion alta (20 grados, +/- 2)", function() {
            beforeEach(function () {
                config = [{"dispositivo": "fermentador1", "temp_ideal": 20, "tolerancia":2}];
                config.push({"dispositivo": "electrovalvula_frio_fermentador_1", "control": "automatico"})
                config.push({"dispositivo":"bomba_chiller", "control": "automatico"});
            });

            describe("y esta caliente (se miden 30 grados)", function () {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 30}], config);
                });
                it("abre la electrovalvula de frio", function () {
                    var electroValvula1Frio = acciones_sobre(acciones, "electrovalvula_frio_fermentador_1")[0];
                    expect(electroValvula1Frio.accion).to.equal("abrir");
                });

                it("cierra la electrovalvula de calor", function () {
                    var electroValvula1Calor = acciones_sobre(acciones, "electrovalvula_calor_fermentador_1")[0];
                    expect(electroValvula1Calor.accion).to.equal("cerrar");
                });

                it("enciende la bomba del chiller", function () {
                    var bomba = acciones_sobre(acciones, "bomba_chiller")[0];
                    expect(bomba.accion).to.equal("encender");
                });
            });

            describe("y esta en temperatura deseada (se miden 20 grados)", function () {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 20}], config);
                });
                it("cierra la electrovalvula de frio", function () {
                    var electroValvula1 = acciones_sobre(acciones, "electrovalvula_frio_fermentador_1")[0];
                    expect(electroValvula1.accion).to.equal("cerrar");
                });
                it("apaga la bomba del chiler", function () {
                    var bomba = acciones_sobre(acciones, "bomba_chiller")[0];
                    expect(bomba.accion).to.equal("apagar");
                });
            });

            describe("y esta frio (se miden 15 grados)", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 15}], config);
                });
                it("abre la electrovalvula de calor", function() {
                    var electroValvula1 = acciones_sobre(acciones, "electrovalvula_calor_fermentador_1")[0];
                    expect(electroValvula1.accion).to.equal("abrir");
                });

                it("enciende la bomba del calentador", function() {
                    var electroValvula1 = acciones_sobre(acciones, "bomba_calentador")[0];
                    expect(electroValvula1.accion).to.equal("encender");
                });
            });


            //se deja para automatizar mas adelante porque se prioriza el control manual
            describe.skip('y esta a 21 grados ', function() {
                xit("si estaba apagado", function () {})
                xit("si estaba prendido", function () {})
            });
            //se deja para automatizar mas adelante porque se prioriza el control manual
            describe.skip('y esta a 19 grados ', function() {
                xit("si estaba apagado", function () {})
                xit("si estaba prendido", function () {})
            });
        });

        describe("configurado para fermentacion baja (7 grados, +/- 2)", function() {
            beforeEach(function () {
                config = [{"dispositivo": "fermentador1", "temp_ideal": 7, "tolerancia": 2}];
                config.push({"dispositivo": "electrovalvula_frio_fermentador_1", "control": "automatico"});
                config.push({"dispositivo": "bomba_chiller", "control": "automatico"});

            });
            describe("y esta caliente (se miden 10 grados)", function () {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor": "fermentador1", "temperatura": 10}], config);
                });
                it("abre la electrovalvula de frio", function () {
                    var electroValvula1Frio = acciones_sobre(acciones, "electrovalvula_frio_fermentador_1")[0];
                    expect(electroValvula1Frio.accion).to.equal("abrir");
                });
                it("cierra la electrovalvula de calor", function () {
                    var electroValvula1Calor = acciones_sobre(acciones, "electrovalvula_calor_fermentador_1")[0];
                    expect(electroValvula1Calor.accion).to.equal("cerrar");
                });

                it("enciende la bomba del chiller", function () {
                    var bomba = acciones_sobre(acciones, "bomba_chiller")[0];
                    expect(bomba.accion).to.equal("encender");
                });
            });

            describe("y esta en temperatura deseada (se miden 7 grados)", function () {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 7}], config);
                });
                it("cierra la electrovalvula de frio", function () {
                    var electroValvula1 = acciones_sobre(acciones, "electrovalvula_frio_fermentador_1")[0];
                    expect(electroValvula1.accion).to.equal("cerrar");
                });
                it("apaga la bomba del chiler", function () {
                    var bomba = acciones_sobre(acciones, "bomba_chiller")[0];
                    expect(bomba.accion).to.equal("apagar");
                });
            });

            describe("y esta frio (se miden 2 grados)", function() {
                beforeEach(function () {
                    acciones = mediciones.nuevas_mediciones([{"sensor":"fermentador1","temperatura": 2}], config);
                });
                it("abre la electrovalvula de calor", function() {
                    var electroValvula1 = acciones_sobre(acciones, "electrovalvula_calor_fermentador_1")[0];
                    expect(electroValvula1.accion).to.equal("abrir");
                });

                it("enciende la bomba del calentador", function() {
                    var electroValvula1 = acciones_sobre(acciones, "bomba_calentador")[0];
                    expect(electroValvula1.accion).to.equal("encender");
                });
            });
        });
    });

        /*
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
        */


    describe("cuando hay N fermentadores", function() {
        var n;
        var desordenador = 3; //variable para emular parametros en un mal orden
        var config = [];
        beforeEach(function () {
            medidas = [];
            n = 3; // cantidad de fermentadores
            for (var i=desordenador; i < n+desordenador; i++) {
                medidas.push({"sensor": "fermentador" + i.toString(), "temperatura": 18});
                config.push({"dispositivo":"fermentador" + i.toString(), "temp_ideal":20, "tolerancia":2});
                config.push({"dispositivo": "electrovalvula_frio_fermentador_" + i.toString(), "control": "automatico"});
                config.push({"dispositivo": "bomba_chiller", "control": "automatico"});
            }
            acciones = mediciones.nuevas_mediciones(medidas, config);
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

        it("deberia devolver una accion de la bomba del calentador", function() {
            var acciones_sobre_chiller = acciones_sobre(acciones, "bomba_calentador");
            expect(acciones_sobre_chiller.length).to.equal(1);
        });

        describe("y estan todos en temperatura deseada", function(){
            it("deberia apagar la bomba de frio", function() {
                var accion_sobre_bomba = acciones_sobre(acciones, "bomba_chiller")[0];
                expect(accion_sobre_bomba.accion).to.equal("apagar");
            });
        });

        describe("y hay alguno caliente", function(){
            beforeEach(function () {
                medidas[2].temperatura = 30;
                acciones = mediciones.nuevas_mediciones(medidas, config);
            });
            it("deberia encender la bomba de frio", function() {
                var accion_sobre_bomba = acciones_sobre(acciones, "bomba_chiller")[0];
                expect(accion_sobre_bomba.accion).to.equal("encender");
            })
        });

        describe("y hay alguno frio", function(){
            beforeEach(function () {
                medidas[2].temperatura = 15;
                acciones = mediciones.nuevas_mediciones(medidas, config);
            });
            it("solo ese tiene la electrovalvula abierta", function() {
                var acciones_fermentadores = acciones_sobre(acciones, "electrovalvula_calor_fermentador");
                for(var i=0; i<acciones_fermentadores.length; i++) {
                    if (acciones_fermentadores[i].dispositivo == "electrovalvula_calor_fermentador_5") {
                        expect(acciones_fermentadores[i].accion).to.equal("abrir");
                    } else {
                        expect(acciones_fermentadores[i].accion).to.equal("cerrar");
                    }
                }
            });

            it("deberia encender la bomba de calor", function() {
                var accion_sobre_bomba = acciones_sobre(acciones, "bomba_calentador")[0];
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