
var _ = require('../src/util/underscore.js');
var Table = require('../src/table.js');
var Sql = require('../src/abstract.js').Sql,
    sql = new Sql();

var user = new Table('user', ['id', 'username']);

exports.string_column = function (test) {
    test.equal(sql.select().cols('column').toString(), 'SELECT column');
    test.done();
};

exports.string_column = function (test) {
    test.equal(sql.select().cols('column1', 'column2').toString(), 'SELECT column1, column2');
    test.done();
};

exports.table_columns_string = function (test) {
    test.equal(sql.select().cols(user.col('id')).toString(), 'SELECT u1.id');
    test.done();
};

exports.table_columns = function (test) {
    test.equal(sql.select().cols(user.columns.username).toString(), 'SELECT username');
    test.done();
};

exports.from_table = function (test) {
    test.equal(sql.select().cols(user).toString(), 'SELECT u1.id, u1.username');
    test.done();
};

exports.sub_select = function (test) {
    var sub = sql.select().cols('username');
    test.equal(sql.select().cols(user.col('id'), sub).toString(), 'SELECT u1.id, (SELECT username)');
    test.done();
};

exports.sub_select_params = function (test) {
    var sub = sql.select().cols('username').from('user').where({ id: 10 });
    var query = sql.select().cols(user.col('id'), sub).from(user).where(_.obj(user.col('id'), 20));
    
    test.equal(query.format(), 'SELECT u1.id, (SELECT username\nFROM user\nWHERE id = ?)\nFROM user u1\nWHERE u1.id = ?');
    
    test.deepEqual(query.binds(), [10, 20]);
    
    test.done();
};
