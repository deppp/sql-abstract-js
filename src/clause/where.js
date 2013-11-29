
var _ = require('../util/underscore');

var is_special_op = function (value) {
    var test = value;
    
    if (_.isObject(value))
        test = _.keys(value)[0];

    if (! _.isString(test))
        return false;
    
    return (test.charAt(0) == '$');
};

var get_q = function (num) {
    var question = [];
    _.times(num, function () { question.push('?') });

    return question.join(',');
};

var format_special_op = {
    in_op: function (values) {
        var w = this.params['where'];
        w.push.apply(w, values);
        return ' IN (' + get_q(values.length) + ')';
    },

    is_op: function (value) {
        if (value == null) 
            return ' IS NULL';
        else {
            this.params['where'].push(value);
            return ' = ?';
        }
    },
    
    notin_op: function (values) {
        var w = this.params['where'];
        w.push.apply(w, values);
        return ' NOT IN (' + get_q(values.length) + ')';
    },
    
    not_op: function (value) {
        if (value == null)
            return ' IS NOT NULL';
        else {
            this.params['where'].push(value);
            return ' != ?';
        }
    },

    btw_op: function (values) {
        var w = this.params['where'];
        w.push.apply(w, values);
        return ' BETWEEN ? AND ?';
    },
    
    like_op: function (value) {
        this.params['where'].push(value);
        return ' LIKE ?';
    }
};

var process = {
    object: function (keys, join) {
        var self = this;
        if (! join) join = ' AND ';
        
        var res = _.map(keys, function (value, key) {
            if (is_special_op(value)) {
                var name = _.keys(value)[0],
                    op   = name.substring(1) + '_op';
                
                return key + format_special_op[op].call(self, value[name]);
            } else if (is_special_op(key)) {
                var join = (key.substring(1) == 'or') ? ' OR ' : ' AND ',
                    type = _.reftype(value);
                
                return '(' + process[type].call(self, value, join) + ')';
            } else if (_.isObject(value)) {
                var op = _.keys(value)[0];
                self.params['where'].push(value[op]);
                return [key, op, '?'].join(' ');
            } else  {
                self.params['where'].push(value);
                return key + ' = ?';
            }
        });
        
        return res.join(join);
    },

    array: function (keys, join) {
        var self = this;
        
        if (! join) join = ' OR ';
        
        var res = _.map(keys, function (obj) {
            var type = _.reftype(obj);
            return process[type].call(self, obj);
        });
        
         return res.join(join);
    }
};

module.exports = {
    where: function (where) {
        var self = this;
        
        this._where = where;
        this.params['where'] = [];
        
        if (_.isObject(where)) {
            var obj = _.clone(where);
            
            var type = _.reftype(obj);
            var res = process[type].call(self, obj);

            this.forms['where'] = res;
        } else {
            this.forms['where'] = where;
        }
        
        return this;
    },

    addWhere: function (where) {
        
    }
};
