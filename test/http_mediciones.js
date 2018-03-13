var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();

chai.use(chaiHttp);

describe('/POST mediciones', function()  {
    it('para un fermentador devuelve 6 acciones', function(done)  {
        var mediciones = {mediciones:[{sensor:'fermentador1', temperatura: '30'}]};

        chai.request(server)
            .post('/')
            .send(mediciones)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.acciones_a_realizar.should.be.a('array');
                res.body.acciones_a_realizar.length.should.be.eql(6);
                done();
        });
    });

    it('deberia devolver accion sobre en nro de fermentador indicado en el nombre del sensor', function(done)  {
        var mediciones = {mediciones:[{sensor:'chiller', temperatura: '-5'}, {sensor:'fermentador1', temperatura: '30'}]};

        chai.request(server)
            .post('/')
            .send(mediciones)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.acciones_a_realizar[0].dispositivo.should.equal('electrovalvula_frio_fermentador_1');
                done();
            });
    });
});
