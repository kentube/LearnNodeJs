// mocha test sample
describe('Top Level Test Suite', function() {
    describe('Nested Test Suite', function() {
        it('Test 1', function() {

        });

        it('Test 2', function() {
            throw new Error('problem');
        });
    });

    it('Test 3', function() {

    });
});

it('Test 4', function() {

});

var expect = require('chai').expect;
it('Addition Test', function() {
    var foo = 2 + 2;
    expect(foo).to.equal(4);
});

if ('expect style assertions', function() {
    expect(2).to.be.greaterThan(1);
    expect(null).to.not.exist;
    expect(false).to.be.false;
    expect('foo').to.be.a('string');
    expect(function() {
        throw new Error('foo');
    }).to.throw;
    expect([1, 2, 3]).to.have.length(3);
    expect({foo: 'bar'}).to.have.property('foo').and.equal('bar');
});
