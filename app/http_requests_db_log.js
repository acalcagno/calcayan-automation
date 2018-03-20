exports.get_logs = function() {


    var MongoClient = require('mongodb').MongoClient;
    var uri = 'mongodb://heroku_jtg8f10j:m8eofmkrgrvh3uqop33frikkig@ds129028.mlab.com:29028/heroku_jtg8f10j'

    var logs = [];
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var dbo = db.db("heroku_jtg8f10j");

        var from_db = dbo.collection("requests").find();

        from_db.forEach(doc => {
            logs.push({"hora": doc['hora'], "route-path": doc['route-path'], "request-method": doc['request-method']});
        });

        db.close();
        return logs;
    }).then(()=> {
        return logs;
    });
}

        /*{}, function(err, res) {

            if (err) throw err;

            res.forEach(r => {
                rpta.push(r);
            });

            db.close();
        });

        return rpta;
    });

}

exports.save_log = function(req) {

    var MongoClient = require('mongodb').MongoClient;
    var uri = 'mongodb://heroku_jtg8f10j:m8eofmkrgrvh3uqop33frikkig@ds129028.mlab.com:29028/heroku_jtg8f10j'


    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("heroku_jtg8f10j");

        dbo.collection("requests").insertOne(req, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
}


    /*
     * Copyright (c) 2017 ObjectLabs Corporation
     * Distributed under the MIT license - http://opensource.org/licenses/MIT
     *
     * Written with: mongoose@5.0.3
     * Documentation: http://mongoosejs.com/docs/index.html
     * A Mongoose script connecting to a MongoDB database given a MongoDB Connection URI.
     */
    //const mongoose = require('mongoose');
    //let uri = 'mongodb://user:pass@host:port/dbname';

    //var mongodb = require('mongodb');

    //var uri = 'mongodb://heroku_jtg8f10j:m8eofmkrgrvh3uqop33frikkig@ds129028.mlab.com:29028/heroku_jtg8f10j'



    //mongoose.connect(uri);

    //var db = mongoose.connection;

    //db.on('error', console.error.bind(console, 'connection error:'));
   // mongoose.connection.db.save(req);
    /*
        db.once('open', function callback() {
            db.save(req);

            var RequestToSave = mongoose.model('requests');
            RequestToSave.insert(req);
    });*/
