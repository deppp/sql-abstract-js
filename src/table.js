
var _ = require('./util/underscore');

var Dao = require('./dao');

function Column (name, options) {
    if (! options) options = {};
    
    this.name = name;
    this.primary = options.primary;
    this.options = options;
};

function Table (options, columns) {
    options = options || {};
    
    if (_.isString(options))
        options = { table: options };
    
    this.initialize(options, columns);
};

module.exports = Table;

Table.prototype.initialize = function (options, columns) {
    var self = this;

    // initialization order is important here
    this._alias_created = 1;
    this.alias_num = options.alias_num || 1;

    this._primary_column = options.primary_column || 'id';
    this._table = options.table || options.name;
    this.alias  = options.alias || this._get_alias();

    var process = {
        object: function (column_def, column_name) {
            var col = new Column(column_name, column_def);
            if (col.primary)
                self._primary_column = col;
            
            return _.obj(column_name, col);
        },
        
        array: function (column_name) {
            return process.object({}, column_name);
        }
    };
    
    this.columns = _.maphash(columns, process[_.reftype(columns)]);
    
    if (! (this._primary_column instanceof Column)) {
        if (! this.columns[this._primary_column])
            throw new Error('No primary column ' + this._primary_column + ' found');
        
        this._primary_column = this.columns[this._primary_column];
    }
    
    this.options = options;
};

Table.prototype.cols = function () {
    return _.map(this.columns, _.passfirst(this.col, this));
};

Table.prototype.col = function (column) {
    if (! (column instanceof Column))
        column = this.columns[column]; 
    
    return (column) ?
        this.alias + '.' + column.name :
        null;
};

Table.prototype.star = function () {
    return this.alias + '.*';
};

Table.prototype.table = function () {
    return this._table + ' ' + this.alias;
};

Table.prototype.aliased = function () {
    var options = _.extend(_.clone(this.options), {
        alias_num: this._alias_created + 1
    });
    
    this._alias_created++;
    
    return new Table(
        options,
        _.clone(this.columns)
    );
};

Table.prototype._get_alias = function () {
    return this._table.substring(0, 1) + this.alias_num; 
};

Table.prototype.dao = function (db, data) {
    return new Dao({
        db    : db,
        data  : data,
        table : this
    });
};

Table.prototype.get = function (id) {
    return this._find(
        this,
        _.obj(this.col(this._primary_column), id)
    );
};

Table.prototype.find = function (where) {
    var self = this,
        aliased_where = {};
    
    _.each(where, function (val, column) {
        if (column.indexOf('.') == -1)
            column = self.alias + '.' + column;
        
        aliased_where[column] = val;
    });
    
    return this._find(this, aliased_where);
};

Table.prototype.all = function () {
    return this._find(this);
};

Table.prototype.find_or_create = function () {
    
};

Table.prototype._find = function (cols, where) {
    var SQL = require('./abstract');
    var sql = new SQL.Sql();
    
    var query = sql.select().
        cols(cols).
        from(this);
    
    if (where)
        query = query.where(where);
    
    return query;
};
