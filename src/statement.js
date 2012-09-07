
var _    = require('underscore'),
    util = require('util');

_.mixin({
    // check for numbers
    isEmptyObject: function (obj) {
        return (_.isNumber(obj)) ?
            false :
            _.isEmpty(obj);
    }
})

function Statement (options) {
    this.initialize(options);
};

module.exports = Statement;

Statement.prototype.initialize = function (options) {
    if (! options) options = {};
    
    this.forms  = {};
    this.params = {};
    this.special_formatter = {};
    
    this.options = _.defaults(options, {
        pp: true
    });
    
    this.setup();
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

// 
Statement.prototype.binds = function (subst) {
    var self = this;
    var params = _.map(this.clause_order, function (clause) {
        return self.params[clause];
    });

    console.log(self.params);
    params = _.flatten(_.compact(params));
    
    if (_.isObject(subst)) {
        return _.map(params, function (param) {
            return (
                _.isString(param) &&
                param.charAt(0) == ':' &&
                _.has(subst, param.substr(1))
            ) ?
                subst[param.substr(1)] :
                param;
        });
    } else {
        return params;
    }
};

Statement.prototype.format = function () {
    var self  = this,
        parts = [];
    
    _.each(this.clause_order, function (clause) {
        var defs = self.forms[clause];
        if (_.isUndefined(defs) || _.isEmptyObject(defs))
            return;
        
        var formatted,
            formatter = self.special_formatter[clause];
        
        if (_.isFunction(formatter))
            formatted = formatter(clause, defs);
        else
            formatted = clause.toUpperCase() + ' ' + defs
        
        parts.push(formatted);
    });
    
    return (this.options.pp) ?
        parts.join("\n") :
        parts.join(' ')  ;
};

// do not use
Statement.prototype.toString = function (subst) {
    var sql    = this.format(),
        params = this.binds(subst);
    
    _.each(params, function (param) {
        // if (_.isString(param))
        //     param = '"' + param + '"';
        
        sql = sql.replace('?', param);
    });
    
    return sql;
};
