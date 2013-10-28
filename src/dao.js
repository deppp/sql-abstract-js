
var _ = require('./util/underscore');

function Dao (options) {
    this.db    = options.db;
    this.data  = options.data;
    this.table = options.table;
};

Dao.prototype.create = function () {
    
};

Dao.prototype.update = function () {
    
};

Dao.prototype.delete = function () {
    
};

Dao.prototype.update_or_create = function () {
    
};

Dao.prototype.add_child_dao = function (table, data) {
    var ref = this.data[table._table];
    if (! ref) ref = [];

    var dao = new Dao({
        db    : this.db,
        data  : data,
        table : table
    });
    
    ref.push(dao);
    this.data[table._table] = ref;

    return dao;
};

Dao.prototype.json = function () {
    var json = {};
    
    _.each(this.data, function (value, name) {
        json[name] = (_.isArray(value) && value[0] instanceof Dao) ?
            value[0].json() : 
            value        ;
    });

    return json;
};

module.exports = Dao;
