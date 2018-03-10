const PORT = process.env.PORT || 5000

var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

app.get('/', function (req, res) {
    res.send("get");
});


app.post('/', function (req, res) {
    res.send({"CONTACTORES":[{"contactor":"1","estado":"on"},
        {"contactor":"2","estado":"on"},
        {"contactor":"3","estado":"on"},
        {"contactor":"4","estado":"off"},
        {"contactor":"5","estado":"on"},
        {"contactor":"6","estado":"off"},
        {"contactor":"7","estado":"on"},
        {"contactor":"8","estado":"off"}]
    });
});

app.listen(PORT, function () {
    console.log(`Example app listening on port ${ PORT }`);
});

module.exports = app; // for testing