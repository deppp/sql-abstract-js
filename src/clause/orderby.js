
var _ = require('underscore');

module.exports = {
    orderby: function (defs) {
        var ordr = undefined;
        
        if (_.isString(defs))
            ordr = defs;
        else if (_.isArray(defs))
            ordr = defs.join(', ')
        else if (_.isObject(defs)) {
            ordr = _.map(defs, function (sort, column) {
                return column + ' ' + sort.toUpperCase();
            }).join(', '); 
        }
        
        this.forms['order by'] = ordr;
        return this;
    }
};
