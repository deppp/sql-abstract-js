
var _ = require('underscore');

module.exports = {
    offset: function (offset) {
        this.forms['offset'] = offset;
        return this;
    }
};
