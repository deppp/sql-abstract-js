
var pg = require('pg'),
    _  = require('../util/underscore');

function reformat_query (str) {
    var i = 1;
    while (true) {
        var idx = str.indexOf('?');
        if (idx == -1)
            break;
        
        str = str.replace('?', '$' + i++);
    }
    
    return str;
}

function PostgreSQL (conargs) {
    this.constr = _.formatobj('tcp://{username}:{password}@{host}/{database}', conargs);
};

module.exports = PostgreSQL;

PostgreSQL.prototype.query = function (query, cb) {
    var q = query.query ? query.query : query;
    
    pg.connect(this.constr, function (err, client, done) {
        if (err) return cb(err);
        
        client.query(reformat_query(q.format()), q.binds(), function () {
            cb.apply(null, _.toArray(arguments));
            done();
        });
    });
};
