
var _         = require('underscore'),
    util      = require('util'),
    Statement = require('../statement');

function Select (options) {
    this.print_name = 'SELECT';
    this._load_clause(['where', 'groupby', 'orderby', 'limit', 'offset']);
    
    this.clause_order = ['select', 'from', 'join', 'where', 'group by', 'order by', 'limit', 'offset'];
    
    this.initialize(options);
}

module.exports = Select;
util.inherits(Select, Statement);

Select.prototype.setup = function () {
    this.forms  = { join: [] };
    this.params = { where: [] };
    this.special_formatter = {
        join: function (clause, defs) {
            return defs.join(' ');
        }
    };
};

Select.prototype.rows = function (rows) {
    this._select = rows;
    
    if (_.isString(rows)) {
        this.forms['select'] = rows;
    } else if (_.isArray(rows)) {
        // [todo] we need to account for binds/params
        var list = _.map(rows, function (obj) {
        //     if (obj instanceof Sql)
        //         obj = '(' obj.toString() + ')';
            
            return obj;
        });
        
        this.forms['select'] = list.join(', ');
    }
    
    return this;
};

Select.prototype.addRows = function (rows) {
    return this.rows(this._add_more(this._select, rows));
};

Select.prototype.from = function (tables) {
    if (! util.isArray(tables))
        tables = [ tables ];

    this.forms['from'] = tables.join(', ');
    return this;
};

Select.prototype.join = function (type, table, on) {
    var join = '',
        args = _.toArray(arguments);
    
    switch (args.length) {
        case 1:
            join = 'JOIN ' + args[0];
            break;
        case 2:
            join = 'JOIN ' + args[0] + ' ON ' + args[1];
            break;
        case 3:
            join = args[0].toUpperCase() + ' JOIN ' + args[1] + ' ON ' + args[2];
            break;
    }
    
    this.forms['join'].push(join);
    
    return this;
};

Select.prototype.leftJoin = function (table, on) {
    return this.join('LEFT', table, on);
};
