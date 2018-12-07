const PORT = process.env.PORT || 5000

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var path = require("path")
var _ = require("underscore")
var ObjectID = require('mongodb').ObjectID
var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(log)

var MongoClient = require('mongodb').MongoClient;

app.use(express.static(path.join(__dirname, 'public')))

//listar el contenido de la coleccion dispositivos de la base (se usa para generar el panel de control)
app.get('/dispositivos', function(req, res) {
    db.collection('dispositivos').find().toArray(function(err, result) {
        if(err) {
            console.log('Existió un error al recuperar los dispositivos de la base de datos durante la operacion GET "/dispositivos"')
            console.log(err)
        }
        res.send(result)
    })
})

app.post('/control', function(req, res) {
    db.collection('dispositivos').update({_id : req.body.model_id }, { $set: { accion: req.body.accion }}, (err, res) => res.end() )
})

app.post('/mediciones', function(req, res) {
    var req_body = req.body;
    var mediciones = req_body.mediciones;

    var ultima_respuesta

    calcular_respuesta_para_el_procesador(mediciones,
        (acciones, mediciones, dispositivos) => {
            res.send(acciones)
            update_dispositivos(acciones, mediciones, dispositivos)
        },
        () => res.send(error_mediciones()))

})

update_dispositivos = function(acciones, mediciones, dispositivos) {
    var a = acciones


    //seteo las nuevas acciones tomadas
    _.each(acciones, a =>  {
        var disp = _.find(dispositivos, d => d.dispositivo == a.dispositivo)
        if (!disp) {
            console.log('no se encontro el dispositivo ' + a.dispositivo + ' en la base de datos')
        } else {
            if (disp.accion != a.accion) {
                db.collection('dispositivos').update({_id: ObjectID(disp._id)}, { $set: {accion: a.accion}})
            }
        }
    })

    //seteo las nuevas temperaturas medidas
    _.each(mediciones, m => {
        var disp = _.find(dispositivos, d => d.dispositivo == m.sensor)
        if (!disp) {
            console.log('no se encontro el dispositivo ' + m.sensor + ' en la base de datos')
        } else {
            if(disp.temperatura != m.temperatura) {
                db.collection('dispositivos').update({_id: ObjectID(disp._id)}, { $set: {temperatura: m.temperatura}})
            }
        }
    })



}

error_mediciones = function() {
    //esto debe devolver una respusta al procesador de parada de emergencia
    //osea, todas las acciones de apagar y cerrar todo.
}

calcular_respuesta_para_el_procesador = function(mediciones, next, err_callback) {
    db.collection('dispositivos').find().toArray(function(err, dispositivos) {
        if (err) {
            console.log('Existió un error al recuperar los dispositivos de la base de datos durante la operacion POST "/mediciones"')
            console.log(err)
            err_callback()
        } else {
            var acciones = get_acciones(dispositivos)
            next(acciones, mediciones, dispositivos)
        }
    })
}

agregar_accion_en_la_base = function(acciones, dispositivos, nombre_dispositivo) {
    acciones.push({"dispositivo": nombre_dispositivo, "accion": _.find(dispositivos, d => d.dispositivo == nombre_dispositivo).accion});
}

agregar_accion_nula = function(acciones, nombre_dispositivo) {
    acciones.push({"dispositivo": nombre_dispositivo, "accion": 0} );
}

get_acciones = function(dispositivos) {
    var acciones = []

    agregar_accion_en_la_base(acciones, dispositivos, "electrovalvula_frio_fermentador_1")
    agregar_accion_nula(acciones, "electrovalvula_calor_fermentador_1")

    agregar_accion_en_la_base(acciones, dispositivos, "electrovalvula_frio_fermentador_2")
    agregar_accion_nula(acciones, "electrovalvula_calor_fermentador_2")

    agregar_accion_en_la_base(acciones, dispositivos, "electrovalvula_frio_fermentador_3")
    agregar_accion_nula(acciones, "electrovalvula_calor_fermentador_3")

    agregar_accion_en_la_base(acciones, dispositivos, "chiller")
    agregar_accion_en_la_base(acciones, dispositivos, "bomba_chiller")

    agregar_accion_nula(acciones, "calentador")
    agregar_accion_nula(acciones, "bomba_calentador")

    return acciones
}


function log(req, res, next) {
    console.log(req.body)
    next()
}


MongoClient.connect('mongodb://heroku_jtg8f10j:m8eofmkrgrvh3uqop33frikkig@ds129028.mlab.com:29028/heroku_jtg8f10j', function(err, client) {
    if (err) {
        return console.log(err);
    }

    db = client.db('heroku_jtg8f10j'); // whatever your database name is*/
    app.listen(PORT, function () {
        console.log(`Calcayan automation listening on port ${ PORT }`);
    });
});

module.exports = app; // for testing