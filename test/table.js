
var Table = require('../src/table');

exports.table_simple_initialization = function (test) {
    var user = new Table('user', [ 'id', 'username', 'password' ]);
    
    test.deepEqual(user.cols(), [ 'u1.id', 'u1.username', 'u1.password' ], 'Columns');
    test.equal(user.table(), 'user u1', 'Aliased table');
    
    test.done();
};

exports.table_verbose_initialization = function (test) {
    var user = new Table('user', {
        id       : { type: 'int' },
        username : { type: 'str' },
        password : { type: 'str' }
    });
    
    test.deepEqual(user.cols(), [ 'u1.id', 'u1.username', 'u1.password' ], 'Columns');
    test.equal(user.table(), 'user u1', 'Aliased table');
    
    test.done();
};

exports.single_column = function (test) {
    var user = new Table('user', ['id', 'username']);
    
    test.equal('u1.username', user.col('username'));
    test.done();
};

exports.no_primary = function (test) {
    test.throws(function () {
        new Table('user', ['username']);
    });
    
    test.done();
};

exports.table_specify_primary = function (test) {
    var user = new Table('user', {
        id       : { type: 'int' },
        username : { type: 'str', primary: true }
    });
    
    test.deepEqual(user._primary_column, user.columns['username']);
    test.done();
};

exports.get_query = function (test) {
    var user = new Table('user', ['id', 'username']);
                         
    test.equal(user.get(10).toString(), 'SELECT u1.id, u1.username\nFROM user u1\nWHERE u1.id = 10');
    test.done();
};

exports.find_query = function (test) {
    var user = new Table('user', ['id', 'username']);
    var res = 'SELECT u1.id, u1.username\nFROM user u1\nWHERE u1.username = depp';
    
    var obj = {};
    obj[ user.col('username') ] = 'depp';
    
    test.equal(user.find(obj).toString(), res, 'Already with alias');
    test.equal(user.find({ 'username': 'depp' }).toString(), res, 'Should add alias');
    
    test.done();
};

exports.all_query = function (test) {
    var user = new Table('user', ['id', 'username']);

    test.equal(user.all(), 'SELECT u1.id, u1.username\nFROM user u1');
    test.done();
};
