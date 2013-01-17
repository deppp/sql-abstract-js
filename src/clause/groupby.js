
var _ = require('underscore');

module.exports = {
    groupby: function (defs) {
        var grp = undefined;
        
        if (_.isString(defs))
            grp = defs;
        else if (_.isArray(defs))
            grp = defs.join(', ');
        
        this.forms['group by'] = grp;
        return this;
    }
};
