
var _ = require('underscore');

_.mixin({
    // check for numbers
    isEmptyObject: function (obj) {
        return (_.isNumber(obj)) ?
            false :
            _.isEmpty(obj);
    }
});

_.mixin({
    install: function (ctx, obj) {
        _.each(obj, function (val, key) {
            ctx[key] = val;
        });
    }
});

_.mixin({
    delegate: function (obj, method) {
        return function () {
            obj[method].apply(obj, _.toArray(arguments));
        };
    },
    
    maphash: function (obj, iterator, ctx) {
        return _.unite(_.map(obj, iterator, ctx));
    },

    unite: function (obj) {
        var res = {};
        _.each(obj, function (val, idx, lst) {
            for (var key in val) {
                if (_.has(val, key)) 
                    res[key] = val[key];
            }
        });
        
        return res;
    },

    obj: function (key, val) {
        var res = {};
        res[key] = val;

        return res;
    },

    passparam: function (num, fun, ctx) {
        return function () {
            var args = _.toArray(arguments);
            return fun.call(ctx, args[num]);
        };
    },

    passfirst: function (fun, ctx) {
        return _.passparam(0, fun, ctx);
    }
});

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
    },
    
    format: function () {
        
    },
    
    formatobj: function (str, obj) {
        var keys = _.keys(obj);
        
        for (var i = 0; i < keys.length; i++) {
            str = str.replace("{" + keys[i] + "}", obj[keys[i]]);
        }
        
        return str;
    }
});

module.exports = _;
