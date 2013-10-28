
var _    = require('./util/underscore'),
    util = require('util');

var Transform = require('./transform');

function Statement (options) {
    this.initialize(options);
};

module.exports = Statement;

Statement.prototype.initialize = function (options) {
    if (! options) options = {};
    
    this.forms  = {};
    this.params = {};
    this.special_formatter = {};
    this.associated_tables = [];
    
    this.options = _.defaults(options, {
        pp: true,
        escape: function (str) {
            return str;
        },

        transform: new Transform()
    });

    this.transform = this.options.transform;
    this.setup();
};

// use DAG instead
Statement.prototype.find_associated_table = function (where) {
    return _.where(_.values(this.associated_tables), where)[0]; 
};

Statement.prototype.find_joined_table = function (table) {
    var alias = null;
    
    _.each(this._joins, function (joined) {
        var a1 = joined[2].split('.')[0],
            a2 = joined[3].split('.')[0];
        
        if (a1 == table.alias)
            return alias = a2;
        else if (a2 == table.alias)
            return alias = a1;
    });
    
    return this.find_associated_table({ alias: alias });
};

Statement.prototype.table_from_query = function () {
    
};

Statement.prototype.setup = function () {};

Statement.prototype._load_clause = function (clauses) {
    if (! util.isArray(clauses))
        clauses = [ clauses ];
    
    clauses.forEach(function (clause) {
        var object = require('./clause/' + clause);
        _.extend(Statement.prototype, object);
    });
};

Statement.prototype._add_more = function (this_obj, more_obj) {
    if (_.isUndefined(this_obj))
        return more_obj;
    else if (_.isString(more_obj) && _.isString(this_obj))
        return this_obj + ' ' + more_obj;
    else if (_.isArray(more_obj) && _.isArray(this_obj)) {
        this_obj.push(more_obj);
        return _.flatten(this_obj);
    } else if (_.isObject(more_obj) && _.isObject(this_obj)) {
        return _.extend(this_obj, more_obj);
    }   
};

// 
Statement.prototype.binds = function (subst) {
    var self = this;
    var params = _.map(this.clause_order, function (clause) {
        return self.params[clause];
    });
    
    params = _.flatten(_.compact(params));
    
    if (_.isObject(subst)) {
        params = _.map(params, function (param) {
            return (
                _.isString(param) &&
                param.charAt(0) == ':' &&
                _.has(subst, param.substr(1))
            ) ?
                subst[param.substr(1)] :
                param;
        });
    }
    
    var subparams = _.map(this.params['subquery'], function (query) {
        return query.binds();
    });
    
    return _.flatten(subparams).concat(params);
};

Statement.prototype.format = function () {
    var self  = this,
        parts = [];

    _.each(this.clause_order, function (clause) {
        var defs = self.forms[clause];
        if (_.isUndefined(defs) || _.isEmptyObject(defs))
            return;

        var formatted = "",
            formatter = self.special_formatter[clause],
        
        formatted = (_.isFunction(formatter)) ?
            formatter(clause, defs) :
            clause.toUpperCase() + ' ' + defs;
        
        parts.push(formatted);
    });
    
    return (this.options.pp) ?
        parts.join("\n") :
        parts.join(' ')  ;
};

// do not use
Statement.prototype.toString = function (subst) {
    var self   = this,
        sql    = this.format(),
        params = this.binds(subst);
    
    _.each(params, function (param) {
        // if (_.isString(param))
        //     param = '"' + param + '"';
        
        sql = sql.replace('?', self.options.escape(param));
    });
    
    return sql;
};
