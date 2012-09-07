
var _         = require('underscore'),
    util      = require('util'),
    Statement = require('../statement');

function Update (options) {
    this.print_name = 'UPDATE';
    this.clause_order = ['update', 'set', 'where', 'order by', 'limit'];
    this._load_clause(['where', 'orderby', 'limit']);
    
    this.initialize(options);
}

module.exports = Update;
util.inherits(Update, Statement);

Update.prototype.setup = function () {
    this.params = {
        set: [],
        where: []
    };
};

Update.prototype.table = function (name) {
    this.forms['update'] = name;
    return this;
}

Update.prototype.set = function (defs) {
    var self = this;
    var str  = _.map(defs, function (value, key) {
        self.params['set'].push(value);
        return key + ' = ?';
    }).join(', ');
    
    this.forms['set'] = str;
    return this;
};
