const PORT = process.env.PORT || 5000
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db;
var MongoClient = require('mongodb').MongoClient;

var express = require('express')
    , hbs     = require('express-hbs')
    , app
;
var hbs_helpers = require('./config/handlebars-helpers');
hbs_helpers.registerCustomHelpers(hbs);

var modulo_mediciones = require("./app/mediciones");
var dispos_module = require("./app/dispositivos");
var http_requests_db_log = require("./app/http_requests_db_log");
var http_api_to_model = require("./app/http_api_to_model");

var dispositivos;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'indexlication/json'}));
app.use(log);

//index.set('view engine', 'ejs');
app.engine('.hbs', hbs.express4({
            layoutsDir: './app/templates/layouts',
            defaultLayout: './app/templates/layouts/layout',
            partialsDir: './app/templates/partials',
            extname: '.hbs',
            helpers: require('./config/handlebars-helpers')}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'app/templates'));

app.get('/scripts/*',function(req, res) {
    res.sendFile(path.join(__dirname, '/public', req.originalUrl));
});

app.get('/panel_de_control', function (req, res) {
    db.collection('dispositivos').find().toArray(function(err, result) {
        if (err) {
            return console.log(err)
        }

        var evs_frio = result.filter(function(d) { return d.dispositivo.indexOf("frio_fermentador_") > -1 } );

        //asociamos la ev_frio con el sensor y la ev_de calor para cada fermentador
        evs_frio.forEach(function(ev) {

            var nro_fermentador = ev.dispositivo.split('_')[ev.dispositivo.split('_').length-1];
            var ev_calor_asociada = result.find(function(d) { return d.dispositivo.indexOf("calor_fermentador_" + nro_fermentador) > -1; });
            var sensor_asociado = result.find(function(d) { return d.dispositivo.indexOf("fermentador" + nro_fermentador) > -1; });

            ev.ev_calor_asociada = ev_calor_asociada;
            ev.sensor_asociado = sensor_asociado;
        });

        res.render('panel_de_control.hbs', { dispositivos: result });
    });
});



app.get('/requests/', function(req, res) {
    db.collection('https').find().toArray(function(err, result)  {
        if (err) {
            return console.log(err)
        };
        res.render('requests.hbs', {https: result});
    });
});


inicializarDispositivos = function(next, mediciones, res){
    dispositivos = new dispos_module.Dispositivos([{"dispositivo": "electrovalvula_frio_fermentador_1", "control": "automatico", "accion": "cerrar", "partial_name": "fermentador"}]);
    dispositivos.configurar({"dispositivo": "electrovalvula_frio_fermentador_2", "control": "automatico", "accion": "cerrar", "partial_name": "fermentador"});
    dispositivos.configurar({"dispositivo": "electrovalvula_frio_fermentador_3", "control": "automatico", "accion": "cerrar", "partial_name": "fermentador"});
    dispositivos.configurar({"dispositivo": "electrovalvula_calor_fermentador_1", "control": "automatico", "accion": "cerrar", "partial_name": "none"});
    dispositivos.configurar({"dispositivo": "electrovalvula_calor_fermentador_2", "control": "automatico", "accion": "cerrar", "partial_name": "none"});
    dispositivos.configurar({"dispositivo": "electrovalvula_calor_fermentador_3", "control": "automatico", "accion": "cerrar", "partial_name": "none"});
    dispositivos.configurar({"dispositivo": "bomba_chiller", "control": "automatico", "accion": "apagar", "partial_name": "bomba"});
    dispositivos.configurar({"dispositivo": "bomba_calentador", "control": "automatico", "accion": "apagar", "partial_name": "bomba"});
    dispositivos.configurar({"dispositivo": "calentador", "control": "automatico", "accion": "apagar", "temp_ideal": 30, "tolerancia": 5, "partial_name": "actuador_termico"});
    dispositivos.configurar({"dispositivo": "chiller", "control": "automatico", "accion": "apagar", "temp_ideal": 5, "tolerancia": 2, "partial_name": "actuador_termico"});
    dispositivos.configurar({"dispositivo": "fermentador1", "temp_ideal": 20, "tolerancia":2, "partial_name": "none"});
    dispositivos.configurar({"dispositivo": "fermentador2", "temp_ideal": 20, "tolerancia":2, "partial_name": "none"});
    dispositivos.configurar({"dispositivo": "fermentador3", "temp_ideal": 20, "tolerancia":2, "partial_name": "none"});
    dispositivos.save_on(db, 'dispositivos', next, mediciones, res);
}




app.post('/control/', function (req, res, next) {
    var nombre_dispositivo = req.body.dispositivo;
    var dispositivo;

    db.collection('dispositivos').find().toArray(function(err, result) {
        if (err) {
            return console.log(err)
        }
        var dispositivos = new dispos_module.Dispositivos(result);
        var dispositivo = dispositivos.buscar_config(nombre_dispositivo);

        if (req.body.accion == "get_manual") {
            dispositivo.control = "manual";
        } else if (req.body.accion == "get_auto") {
            dispositivo.control = "automatico";
        } else if (req.body.accion == "encender") {
            dispositivo.accion = req.body.accion;
        } else if (req.body.accion == "apagar") {
            dispositivo.accion = req.body.accion;
        } else if (req.body.accion == "abrir") {
            dispositivo.accion = req.body.accion;
        } else if (req.body.accion == "cerrar") {
            dispositivo.accion = req.body.accion;
        }

        dispositivos.save_on(db, 'dispositivos', function() {
            db.collection('dispositivos').aggregate(
                [
                    { $sort: { dispositivo: 1, fecha: 1 } },
                    {
                        $group:
                            {
                                _id: "$dispositivo",
                                ultima_fecha: { $last: "$fecha" }
                            }
                    }
                ]
            );


            var evs_frio = result.filter(function(d) { return d.dispositivo.indexOf("frio_fermentador_") > -1 } );

            //asociamos la ev_frio con el sensor y la ev_de calor para cada fermentador
            evs_frio.forEach(function(ev) {

                var nro_fermentador = ev.dispositivo.split('_')[ev.dispositivo.split('_').length-1];
                var ev_calor_asociada = result.find(function(d) { return d.dispositivo.indexOf("calor_fermentador_" + nro_fermentador) > -1; });
                var sensor_asociado = result.find(function(d) { return d.dispositivo.indexOf("fermentador" + nro_fermentador) > -1; });

                ev.ev_calor_asociada = ev_calor_asociada;
                ev.sensor_asociado = sensor_asociado;
            });


            res.render('fermentador.hbs', { layout:false, dispositivo: dispositivo });
            ///res.redirect("/partial_fermentador");
            /*.toArray(function(err, result)  {
                if (err) {
                    return console.log(err)
                };
                var fh = result[0].ultima_fecha;
                db.collection('dispositivos').find({fecha: fh}).toArray(function(err2, result2) {
                    if (err2) {
                        return console.log(err2)
                    };
                    res.render('partials/test',{ layout: false ,
                        locals: {
                            dispositivo: result2[0],
                            dispositivos: result2,
                            render_tarjetas:  ["chiller", "bomba_chiller", "calentador", "bomba_calentador", "electrovalvula_frio_fermentador_1", "electrovalvula_frio_fermentador_2","electrovalvula_frio_fermentador_3"],
                            render_detalle_termico: ["chiller", "calentador"]
                        }}
                    );
                })
            });*/
        });
    });
});

get_acciones = function(mediciones, dispositivos, res) {
    var acciones = modulo_mediciones.nuevas_mediciones(mediciones, dispositivos);
    dispositivos.save_on(db, 'dispositivos', function() {}, mediciones, res)
    var respuesta = http_api_to_model.get_api_response({"acciones_a_realizar": acciones});
    res.send(respuesta);
}

app.post('/mediciones/', function (req, res, next) {

    var req_body = req.body;
    var mediciones = req_body.mediciones;

    db.collection('dispositivos').find().toArray(function(err, result)  {
        if (err) {
            return console.log(err)
        };
        dispositivos = new dispos_module.Dispositivos(result);
        if(result.length == 0) {
            inicializarDispositivos(get_acciones, mediciones, res);
        } else {
            get_acciones(mediciones, dispositivos, res);
        }
    });
});

function log(req, res, next) {

    var req_log = { "hora": new Date(), "route-path": req.originalUrl, "request-method": req.method, "headers": req.headers, "body": req.body };

    var send = res.send;
    res.send = function (body) {
        res.body = body
        send.call(this, body);
    };

    const cleanup = function() {
        res.removeListener('finish', logFn)
        res.removeListener('close', abortFn)
        res.removeListener('error', errorFn)
    }

    const logFn = function() {
        cleanup()
        if (req_log["route-path"] == "/requests") return; //no loguear la consulta de logs.

        const logger = getLoggerForStatusCode(res.statusCode);
        var res_log = {"statusCode": res.statusCode, "statusMessage": res.statusMessage, "body": res.body };
        var https = { "request": req_log, "response": res_log };
        db.collection("https").insertOne(https, function(err, res) {
            if (err) return console.log(err)
            console.log('saved to database')
        });
    }

    const abortFn = function(){
        cleanup();
        var res_log = {"statusCode": "ABORTED BY CLIENT", "statusMessage": 'Request aborted by the client', "body": res.body };
        var https = { "request": req_log, "response": res_log };
        db.collection("https").insertOne(https, function(err, res) {
            if (err) return console.log(err)
            console.log('saved to database')
        });
        //console.warn('Request aborted by the client')
    }

    const errorFn = function(){
        cleanup()
        var res_log = {"statusCode": "PIPELINE ERROR", "statusMessage": 'Request pipeline error: ${err}', "body": res.body };
        var https = { "request": req_log, "response": res_log };
        db.collection("https").insertOne(https, function(err, res) {
            if (err) return console.log(err)
            console.log('saved to database')
        });
    }


    res.on('finish', logFn) // successful pipeline (regardless of its response)
    res.on('close', abortFn) // aborted pipeline
    res.on('error', errorFn) // pipeline internal error


    next();
}

getLoggerForStatusCode = function(statusCode) {
    if (statusCode >= 500) {
        return console.error.bind(console)
    }
    if (statusCode >= 400) {
        return console.warn.bind(console)
    }

    return console.log.bind(console)
}

MongoClient.connect('mongodb://heroku_jtg8f10j:m8eofmkrgrvh3uqop33frikkig@ds129028.mlab.com:29028/heroku_jtg8f10j', function(err, client) {
    if (err) {
        return console.log(err);
    }

    db = client.db('heroku_jtg8f10j'); // whatever your database name is*/
    app.listen(PORT, function () {
        console.log(`Example app listening on port ${ PORT }`);
    });
});




module.exports = app; // for testing