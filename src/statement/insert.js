
var _         = require('underscore'),
    util      = require('util'),
    Statement = require('../statement');

function Insert (options) {
    this.print_name = 'INSERT INTO';
    this.clause_order = ['insert into', 'values'];
    
    this.initialize(options);
}

module.exports = Insert;
util.inherits(Insert, Statement);

Insert.prototype.setup = function () {
    var self = this;
    
    this.special_formatter = {
        'insert into': function (def) {
            return def + ' ' + self.forms['columns'];
        }
    };
    
    this.params = { values: [] };
};

Insert.prototype.into = function (table) {
    this.forms['insert into'] = table;
    return this;
};

Insert.prototype.values = function (defs) {
    var self = this;
    var columns = _.map(defs, function (value, key) {
        self.params['values'].push(value);
        return key;
    });
    
    var question = [];
    _.times(_.size(defs), function () { question.push('?') });
    
    this.forms['columns'] = '(' + columns.join(', ') + ')';
    this.forms['values']  = '(' + question.join(', ') + ')';
    
    return this;
};
    
