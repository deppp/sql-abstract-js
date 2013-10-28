
var _    = require('underscore');
var Sql  = require('../src/abstract').Sql;
var desc = [
    [ { hello: 'world' }, 'hello = world' ],
    [ { 't1.hello': 'world' }, 't1.hello = world' ],
    [ { 'hello': 10 }, 'hello = 10'],
    [ { hello: 'world', more: 'world' }, 'hello = world AND more = world' ],
    [ { $and: [ { hello: 'world' }, { hello: 'more'} ] }, '(hello = world AND hello = more)'],
    
    [ [ { hello: 'world' }, { more: 'world' } ], 'hello = world OR more = world' ],
    [ [ { hello: 'world' }, { hello: 'more' } ], 'hello = world OR hello = more' ],
    [
        { col1: 'val1', $or: { col2: 'val2', col3: 'val3' }, col4: 'val4' },
        'col1 = val1 AND (col2 = val2 OR col3 = val3) AND col4 = val4'
    ],
    [ { $and: { col1: 'val1' } }, '(col1 = val1)' ],

    [ { col1: 'val1', $or: { col2: 'val2', $and: { col3: 'val3', col4: 'val4' } } },
      'col1 = val1 AND (col2 = val2 OR (col3 = val3 AND col4 = val4))' ],
    [ { $and: [ { col1: 'val1' }, { col2: 'val2'}, { $or: { col3: 'val3', col4: 'val4' } } ] },
      '(col1 = val1 AND col2 = val2 AND (col3 = val3 OR col4 = val4))' ],

    [ { col1: 'val1', $or: [
        { $and: { col2: { $not: null }, col3: { $is: null } } },
        { $and: { col4: { $not: null }, col5: { $is: null } } }
      ] },
      'col1 = val1 AND ((col2 IS NOT NULL AND col3 IS NULL) OR (col4 IS NOT NULL AND col5 IS NULL))'
    ],
    
    [ { col1: { $in: [1,2,3] } }, 'col1 IN (1,2,3)' ],
    [ { col1: { $btw: [0, 10] } }, 'col1 BETWEEN 0 AND 10' ],
    [ { col1: { $not: 10 }}, 'col1 != 10' ],
    [ { col1: { $like: '%hello%' } }, 'col1 LIKE %hello%' ]
];

_.each(desc, function (val, idx) {
    exports['where_test_' + idx] = function (test) {
        var query = new Sql().select().where(val[0]);
        
        test.equal(query.toString(), 'WHERE ' + val[1], 'query');
        test.done();
    };
});
