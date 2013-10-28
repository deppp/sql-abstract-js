
var _ = require('./util/underscore');
var DB = require('./db');
var Table = require('./table');
var statements = ['select', 'insert', 'update', 'delete', 'drop', 'create'];

exports.Sql = function (gopt) {
    gopt = gopt || {};
    
    var funs = _.maphash(statements, function (st) {
        var St = require('./statement/' + st);
        return _.obj(st, function (lopt) {
            var opt = _.extend(gopt, lopt);
            return new St(opt);
        });
    });
    
    _.install(this, funs);
};

exports.DB = DB;
exports.Table = Table;

// exports.options = function (opt) {
//     _.each(statements, function (st) {
//         var obj = require('./statement/' + st);
//         var export_name = st.charAt(0).toUpperCase() + st.slice(1);
        
//         exports[export_name] = function (more_opt) {
//             var all_opt = _.extend(_.clone(opt), more_opt);
//             return new obj(all_opt);
//         };
//     });
// };

// _.each(statements, function (st) {
//     var obj = require('./statement/' + st);
//     var export_name = st.charAt(0).toUpperCase() + st.slice(1);
    
//     exports[export_name] = obj;
// });

// exports.Select = require('./statement/select');
// exports.Insert = require('./statement/insert');
// exports.Update = require('./statement/update');
// exports.Delete = require('./statement/delete');
