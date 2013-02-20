
var _ = require('underscore');

_.mixin({
    reftype: function (object) {
        var ref = 'undefined';
        
        if (_.isNumber(object))
            ref = 'number';
        else if (_.isString(object))
            ref = 'string';
        else if (_.isArray(object))
            ref = 'array';
        else if (_.isObject(object))
            ref = 'object';
        
        return ref;
    }
});

function is_special_op (op) {
    var special_ops = _.map(_.keys(format_special_op), function (key) {
        return key.replace('_op', '');
    });
    
    return _.include(special_ops, op);
}

var format_special_op = {
    in_op: function (values, key) {
        var self = this;
        var res = key + ' IN ';

        var question = [];
        _.times(values.length, function () { question.push('?') });

        _.each(values, function (value) {
            self.params['where'].push(value);
        });
        
        return res + '(' + question.join(', ') + ')';
    },
    
    between_op: function (values, key) {
        this.params['where'].push(values[0]);
        this.params['where'].push(values[1]);
        
        return key + ' BETWEEN ? AND ?';
    }, 

    is_op: function (values, key) {
        return key + ' IS ' + values;
    }
};

var formats = {
    array: function (values, key) {
        var self = this;
        var res  = _.map(values, function (value) {
            if (_.isObject(value))
                return formats['object'].call(self, value, key);
            else {
                self.params['where'].push(value);
                return key + ' = ?';
            }
        });
        
        return '(' + res.join(' OR ') + ')';
    },
    
    object: function (values, key) {
        var op = (_.keys(values))[0];
        
        if (is_special_op(op))
            return format_special_op[op + '_op'].call(this, values[op], key);
        else {
            this.params['where'].push(values[op]);
            return [key, op, '?'].join(' ');
        }
    },
    
    string: function (value, key) {
        this.params['where'].push(value);
        return key + ' = ?';
    },

    number: function (value, key) {
        return formats['string'].call(this, value, key);
    }
};

module.exports = {
    where: function (where) {
        var self = this;
        
        this._where = where; 
        this.params['where'] = [];
        
        if (_.isObject(where)) {
            var obj = _.clone(where);
            var res = _.map(obj, function (value, key) {
                // [TODO] fix numbers!
                var format = _.reftype(value);
                return formats[format].call(self, value, key);
            });
            
            where = res.join(' AND ');
        }
        
        this.forms['where'] = where;
        
        return this;
    },
    
    addWhere: function (where) {
        if (_.isUndefined(this._where))
            this.where(where);
        else if (_.isString(where) && _.isString(this._where))
            this.where(this._where + ' ' + where);
        else if (_.isObject(where) && _.isObject(this._where)) {
            this.where(_.extend(this._where, where));
        }   
        
        return this;
    }
};
