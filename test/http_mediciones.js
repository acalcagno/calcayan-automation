var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();

chai.use(chaiHttp);

describe('/POST mediciones', function()  {
    it('it should POST', function(done)  {
        var mediciones = {mediciones:[{sensor:'fermenador1', temperatura: '30'}]};

        chai.request(server)
            .post('/')
            .send(mediciones)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.acciones_a_realizar.should.be.a('array');
                res.body.acciones_a_realizar.length.should.be.eql(3);
                done();
        });
    });
});
