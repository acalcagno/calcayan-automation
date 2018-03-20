const PORT = process.env.PORT || 5000

var express = require('express');
var index = express();
var bodyParser = require('body-parser');
var modulo_mediciones = require("./app/mediciones");
var http_requests_db_log = require("./app/http_requests_db_log");

index.use(bodyParser.json());
index.use(bodyParser.urlencoded({extended: true}));
index.use(bodyParser.text());
index.use(bodyParser.json({ type: 'indexlication/json'}));

index.set('view engine', 'ejs');

var db;

index.get('/', function (req, res) {
    //log(req);
    res.send("get");
});

index.get("*", function(err, req, next) {
    console.log("test");
    console.log(err);
    log(req.req);


    next();
});

index.post("*", function(err, req, next) {
    console.log("test");
    console.log(err);
    log(req.req);


    next();
});

index.get('/requests/', function(req, res) {
    //res.sendFile(__dirname + '/app/requests.html')

    db.collection('requests').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('requests.ejs', {requests: result})
})


    /*
    var cursor = db.collection('requests').find();


    var arr = db.collection('requests').find().toArray(function(err, results) {

        res.render('index.ejs', {quotes: result});
        //console.log(results)
        // send HTML file populated with quotes here
    })
*/

});

index.post('/mediciones/', function (req, res) {

    //log(req);
    var req_body = req.body;
    var mediciones = req_body.mediciones;
    var config;/// = [];

    var acciones = modulo_mediciones.nuevas_mediciones(mediciones, config);
    res.send({"acciones_a_realizar": acciones});

});

var db;
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://heroku_jtg8f10j:m8eofmkrgrvh3uqop33frikkig@ds129028.mlab.com:29028/heroku_jtg8f10j', (err, client) => {
    if (err) return console.log(err)
        db = client.db('heroku_jtg8f10j') // whatever your database name is*/
    index.listen(PORT, function () {
        console.log(`Example index listening on port ${ PORT }`);
    });
});


log = function(req, res) {
    var req_log = { "hora": new Date().toString(), "route-path": req.route.path, "request-method": req.method, "headers": req.headers, "body": req.body };
    db.collection("requests").insertOne(req_log, function(err, res) {
        if (err) return console.log(err)
        console.log('saved to database')
        //res.redirect('/')
    });
    //http_requests_db_log.save_log(req_log);
}

module.exports = index; // for testing