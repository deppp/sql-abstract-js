
var _ = require('underscore');
var statements = ['select', 'insert', 'update', 'delete'];

exports.options = function (opt) {
    _.each(statements, function (st) {
        var obj = require('./statement/' + st);
        var export_name = st.charAt(0).toUpperCase() + st.slice(1);
        
        exports[export_name] = function (more_opt) {
            var all_opt = _.extend(_.clone(opt), more_opt);
            return new obj(all_opt);
        }
    });
};

_.each(statements, function (st) {
    var obj = require('./statement/' + st);
    var export_name = st.charAt(0).toUpperCase() + st.slice(1);
    
    exports[export_name] = obj;
});

// exports.Select = require('./statement/select');
// exports.Insert = require('./statement/insert');
// exports.Update = require('./statement/update');
// exports.Delete = require('./statement/delete');
