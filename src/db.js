
var _ = require('./util/underscore');
var Table = require('./table');

function Runner (db, query) {
    var self = this;
    
    this.run = function () {
        db._db.query(query, function (err, data) {
            if (err && self._failure_cb)
                self._failure_cb(err);
            else if (self._success_cb)
                self._success_cb(data);
        });
    };
    
    this.success = function (cb) {
        self._success_cb = cb;
        return self;
    };
    
    this.failure = function (cb) {
        self._failure_cb = cb;
        return self;
    };
};

function DB (type, options) {
    var Driver = require('./db/' + type);
    this._db = new Driver(options);

    _.bindAll(this, 'query');
};

module.exports = DB;

DB.prototype.query = function (query, cb) {
    if (! cb)
        return new Runner(this, query);
    else
        this._db.query(query, cb);
};

DB.prototype.dao = function (query, cb) {
    var self = this;

    if (! query.associated_tables.length)
        return cb('No associated tables for query');

    this.query({ query: query, nestTables: true }).success(function (data) {
        query.transform.run(self, query, data, cb);
    }).failure(cb).run();
};
