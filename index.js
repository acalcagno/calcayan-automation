const PORT = process.env.PORT || 5000

var express = require('express');
var index = express();
var bodyParser = require('body-parser');

var modulo_mediciones = require("./app/mediciones");
var http_requests_db_log = require("./app/http_requests_db_log");
var http_api_to_model = require("./app/http_api_to_model");

index.use(bodyParser.json());
index.use(bodyParser.urlencoded({extended: true}));
index.use(bodyParser.text());
index.use(bodyParser.json({ type: 'indexlication/json'}));
index.use(log);

index.set('view engine', 'ejs');

var db;
var MongoClient = require('mongodb').MongoClient;

index.get('/', function (req, res) {
    //log(req);
    res.send("get");
});

index.get('/requests/', function(req, res) {

    db.collection('https').find().toArray(function(err, result)  {
        if (err) {
            return console.log(err)
        };
        res.render('requests.ejs', {https: result});
    });
});


index.post('/mediciones/', function (req, res) {

    //log(req);
    var req_body = req.body;
    var mediciones = req_body.mediciones;
    var config;/// = [];

    var acciones = modulo_mediciones.nuevas_mediciones(mediciones, config);
    var respuesta = http_api_to_model.get_api_response({"acciones_a_realizar": acciones});
    res.send(respuesta);

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
    index.listen(PORT, function () {
        console.log(`Example index listening on port ${ PORT }`);
    });
});


module.exports = index; // for testing