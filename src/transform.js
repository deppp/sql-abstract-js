
var _ = require('./util/underscore');

function Transform (options) {
    this._cache_lookup = [];
};

Transform.prototype.run = function (db, query, data, cb) {
    var self = this,
        daos = [];
        
    cb(null, daos);
};

module.exports = Transform;
