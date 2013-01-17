
var _ = require('underscore');

module.exports = {
    orderby: function (defs) {
        var grp = undefined;
        
        if (_.isString(defs))
            grp = defs;
        else if (_.isArray(defs))
            grp = defs.join(', ');
        
        this.forms['group by'] = ordr;
        return this;
    }
};
