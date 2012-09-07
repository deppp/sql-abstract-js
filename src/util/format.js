
// // formats query with params included
// Sql.prototype.format = function () {
    
// };

// formats query with placeholders
// Sql.prototype.toString = function () {
//     var formatted = [];
    
//     var where = this.format_where();
//     var res = [
//         ['SELECT' , this._select ],
//         ['FROM'   , this._from   ],
//         [ this._joins            ],
//         ['WHERE' , where[0]      ],
//         ['LIMIT' , this._limit   ]
//     ];
    
//     res.forEach(function (obj) {
//         if (typeof(obj[0]) === 'object' &&
//             obj[0].length !== 0
//         ) {
//             formatted.push(obj[0].join(' '));
//         } else if ((typeof(obj[1]) === 'string' &&
//                    obj[1].length > 0) || typeof(obj[1]) === 'number'
//         ) {
//             formatted.push(obj[0]);
//             formatted.push(obj[1]);
//         }
//     });
    
//     console.log(formatted);
    
//     return (this.pp) ?
//         formatted.join("\n") :
//         formatted.join(' ')  ;
// };
