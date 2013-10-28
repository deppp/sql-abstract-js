
var _     = require('../util/underscore'),
    mysql = require('mysql');

function MySQL (conargs) {
    this.pool = mysql.createPool(conargs);
}

module.exports = MySQL;

MySQL.prototype.query = function (query, cb) {
    var q = query.query ? query.query : query,
        opt = {
            nestTables: query.nestTables
        };
    
    this.pool.getConnection(function(err, connection) {
        if (err) return cb(err);

        var params = _.extend(opt, {
            sql: q.format()
        });

        connection.query(params, q.binds(), function(err, data) {
            cb(err, data);
            connection.end();
        });
    });
};
