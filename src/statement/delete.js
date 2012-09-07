
var _         = require('underscore'),
    util      = require('util'),
    Statement = require('../statement');

function Delete (options) {
    this.print_name = 'DELETE';

    this.clause_order = ['delete from', 'where', 'orderby', 'limit'];
    this._load_clause(['where', 'orderby', 'limit']);
    
    this.initialize(options);
}

module.exports = Delete;
util.inherits(Delete, Statement);

Delete.prototype.setup = function () {
    this.params = { where: [] };  
};

Delete.prototype.from = function (table) {
    this.forms['delete from'] = table;
    return this;
};
