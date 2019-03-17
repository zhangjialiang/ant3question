let assert = require('chai').assert;
let expect = require('chai').expect;
let {calculate} = require('../src/index');
describe('calculate', function() {
    it('should return correct value by calculating', function() {
        let expression = '(1+2+3*(5-2)/4)^2';
        let expression2 = '1+3/4^2-5';
        let expression3 = '-3-(4+2)^5/6';
        let expression4 = '(+1+4/2)^(3/2+2)';
        assert.equal(calculate(expression), 27.5625);
        assert.equal(calculate(expression2), -3.8125);
        assert.equal(calculate(expression3), -1299);
        assert.equal(calculate(expression4), 46.76537180435969);
    });
    it('should throw error when brackets is odd', function() {
        let expression1 = '(1+2';
        let expression2 = '1+2)';
        expect(calculate.bind(expression1)).to.throw();
        expect(calculate.bind(expression2)).to.throw();
    });
    it('should throw error when divisor is 0', function() {
        let expression1 = '2+1/0';
        expect(calculate.bind(expression1)).to.throw();
    });
});
