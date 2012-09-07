
var _ = require('underscore');

module.exports = {
    limit: function (limit) {
        this.forms['limit'] = (_.isArray(limit) && limit.length > 1) ?
            limit[0] + ", " + limit[1] :
            limit ;
        
        return this;
    }
};
