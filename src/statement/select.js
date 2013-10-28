
var _         = require('underscore'),
    util      = require('util'),
    Statement = require('../statement');

var Table = require('../table');

function Select (options) {
    this.print_name = 'SELECT';
    this._load_clause(['where', 'groupby', 'orderby', 'limit', 'offset']);
    this.clause_order = ['select', 'from', 'join', 'where', 'group by', 'order by', 'limit', 'offset'];
    
    this.initialize(options);
}

module.exports = Select;
util.inherits(Select, Statement);

Select.prototype.setup = function () {
    this._joins = [];
    
    this.forms  = { join: [] };
    this.params = { where: [], subquery: [] };
    
    this.special_formatter = {
        join: function (clause, defs) {
            return defs.join(' ');
        }
    };
};

Select.prototype.cols = function () {
    var self = this,
        cols = _.flatten(_.toArray(arguments));
    
    this._select = cols;
    
    var list = _.map(cols, function (obj) {
        var str = '';
        
        if (_.isString(obj)) {
            str = obj; 
        } else if (obj instanceof Table) {
            str = obj.cols();
        } else if (obj instanceof Select) {
            str = '(' + obj.format() + ')';
            self.params['subquery'].push(obj);
        } else {
            str = obj.name;
        }
        
        return str;
    });
    
    this.forms['select'] = _.flatten(list).join(', ');
    
    return this;
};

Select.prototype.addCols = function () {
    var cols = _.toArray(arguments);
    return this.cols(this._add_more(this._select, cols));
};

Select.prototype.from = function (tables) {
    this.associated_tables.push(tables);
    
    if (tables instanceof Table)
        tables = tables.table();
    
    if (! util.isArray(tables))
        tables = [ tables ];
    
    this.forms['from'] = tables.join(', ');
    return this;
};

Select.prototype._format_join = function (params) {
    var join = [ params.type, 'JOIN', params.table ];
    
    if (params.left)
        join.push('ON', params.left);
    
    if (params.right)
        join.push('=', params.right);
    
    return join.join(' ');
};

Select.prototype._join = function (type, table, left, right) {
    var params = {};
    
    this._joins.push([ type, table, left, right ]);
    
    var table_name = (table instanceof Table) ?
        table.table() :
        table;

    params.table = table_name;
    params.type  = type;
    params.left  = left;
    params.right = right;
    
    this.associated_tables.push(table);
    this.forms['join'].push(this._format_join(params));
    
    return this;
};

Select.prototype.join = function (table, left, right) {
    return this._join(null, table, left, right);
};

Select.prototype.leftJoin = function (table, left, right) {
    return this._join('LEFT', table, left, right);
};
