var _         = require('../util/underscore'),
    util      = require('util'),
    Statement = require('../statement');

function Drop (options) {
    this.print_name = 'DROP';
    this.clause_order = ['drop'];
    
    this.initialize(options);
}

module.exports = Drop;
util.inherits(Drop, Statement);

Drop.prototype.setup = function () {};

Drop.prototype.database = function (name) {
    this.forms['drop'] = 'DATABASE ' + name;
    return this;
};

Drop.prototype.table = function (name) {
    this.forms['drop'] = 'TABLE ' + name;
    return this;
};
