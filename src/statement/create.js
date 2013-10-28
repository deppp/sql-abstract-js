var _         = require('../util/underscore'),
    util      = require('util'),
    Statement = require('../statement');

function Create (options) {
    this.print_name = 'CREATE';
    this.clause_order = ['create'];
    
    this.initialize(options);
}

module.exports = Create;
util.inherits(Create, Statement);

Create.prototype.setup = function () {};

Create.prototype.database = function (name) {
    this.forms['create'] = 'DATABASE ' + name;
    return this;
};

Create.prototype.table = function (name) {
    this.forms['create'] = 'TABLE ' + name;
    return this;
};
