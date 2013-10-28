
var _ = require('../src/util/underscore');

exports.passparam = function (test) {
    var fun1 = _.passparam(0, function (first_param) {
        test.equal(first_param, 'hello', 'passparam 0');
    });

    var fun2 = _.passparam(1, function (first_param) {
        test.equal(first_param, 'world', 'passparam 0');
    })
    
    fun1('hello', 'world');
    fun2('hello', 'world');
    test.done();
};

exports.passfirst = function (test) {
    var fun = _.passfirst(function (first_param) {
        test.equal(first_param, 'hello', 'passfirst');
    });
    
    fun('hello', 'world');
    test.done();
};
