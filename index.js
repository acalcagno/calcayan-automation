const PORT = process.env.PORT || 5000

var express = require('express');
var index = express();
var bodyParser = require('body-parser');
var modulo_mediciones = require("./app/mediciones");

index.use(bodyParser.json());
index.use(bodyParser.urlencoded({extended: true}));
index.use(bodyParser.text());
index.use(bodyParser.json({ type: 'indexlication/json'}));

index.get('/', function (req, res) {
    res.send("get");
});


index.post('/mediciones/', function (req, res) {
    var req_body = req.body;
    var mediciones = req_body.mediciones;

    var acciones = modulo_mediciones.nuevas_mediciones(mediciones);
    res.send({"acciones_a_realizar": acciones});
});

index.listen(PORT, function () {
    console.log(`Example index listening on port ${ PORT }`);
});

module.exports = index; // for testing