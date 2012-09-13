
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
        pp: true,
        escape: function (str) {
            return str;
        }
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

    // console.log(self.params);
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
