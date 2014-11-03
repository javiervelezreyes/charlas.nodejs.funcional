'use strict';

var fp = require ('./fp');

var tests = fp.describe ('test suite')(

    fp.it('reverse test', function () {
    
        var add = function (x, y) { return x + y; };
        var sub = function (x, y) { return x - y; };

        var radd = fp.reverse (add);
        var rsub = fp.reverse (sub);

        return ( 
            (radd (2, 8) === add (2, 8)) &&
            (radd (2, 8) === add (8, 2)) &&
            (rsub (2, 8) !== sub (2, 8)) &&
            (rsub (2, 8) === sub (8, 2)) 
        );

    }),
    
    fp.it('swap test', function () {
    
        var exp = function (x, y, z){ 
            return x + y * z;
        };
        
        var expSwp1 = fp.swap (exp, [0, 1]);
        var expSwp2 = fp.swap (exp, [0, 2]);
        
        return (
            (exp     (2,3,5) === 17) &&
            (expSwp1 (2,3,5) === 13) &&
            (expSwp2 (2,3,5) === 11)
        );
        
    }),
    
    fp.it('arity test', function () {
    
        var unary = fp.arity (1);
        
         return (
            (['1', '2', '3'].map(parseInt) !== [1, 2, 3]) &&
            (['1', '2', '3'].map(unary(parseInt)))
        );

    }),
    
    fp.it('variadic test', function () {
    
        var basket = fp.variadic (
            function (date, user, products) {
                return [date, user, products];
        });
        
        return (
            basket(
              'hoy', 'jvelez', 
              'platanos', 'manzanas', 'peras') === ['hoy', 'jvelez', 
              'platanos', 'manzanas', 'peras']
        );
    }),
    
    fp.it('first test', function () {
    
        var ip = function (a, b, c, d) { 
            return [a, b, c, d]; 
        };
        var prvIp = fp.first (ip, 192, 168);
        var pubIp = fp.first (ip, 62, 27);
        
        return (    
            prvIp (15, 12) === [192,168,15,12] &&
            pubIp (23, 31) === [62,27,23,31]
        );

    }),
    
    fp.it('last test', function () {
    
        var ip = function (a, b, c, d) { 
            return [a, b, c, d]; 
        };
       var gwIp  = fp.last (ip, 1, 1);
   
         return (    
           gwIp  (192, 168) === [192,168,1,1]
        );

    }),
    
    fp.it('partial & rpartial test', function () {
    
        var add = fp.partial (function (x, y) { return x + y });
        var sub = fp.rpartial (function (x, y) { return x - y });
        var inc = add(1);
        var dec = sub(1);
        
        return (
            [inc(3), dec(4)] === [4, 3]
        );

    }),
    
    fp.it('curry test', function () {
    
        var Ip = function (a, b, c, d) {
            return [a, b, c, d]; 
        };
        var cIp = fp.curry(Ip);

        return (
            (cIp (192, 168, 1, 1) === [192, 168, 1, 1]) &&
            (cIp (192, 168, 1)(1) === [192, 168, 1, 1]) &&
            (cIp (192, 168)(1, 1) === [192, 168, 1, 1]) &&
            (cIp (192, 168)(1)(1) === [192, 168, 1, 1]) &&
            (cIp (192)(168, 1, 1) === [192, 168, 1, 1])
        );

    }),
    
    fp.it('rcurry test', function () {
    
        var Ip = function (a, b, c, d) {
            return [a, b, c, d]; 
        };
        var rcIp = fp.rcurry(Ip);
        
        return (
            rcIp (192, 168, 1, 1) === [192, 168, 1, 1] &&
            rcIp (168, 1, 1)(192) === [192, 168, 1, 1] &&
            rcIp (1, 1)(192, 168) === [192, 168, 1, 1] &&
            rcIp (1, 1)(168)(192) === [192, 168, 1, 1] &&
            rcIp (1)(192, 168, 1) === [192, 168, 1, 1] &&
            rcIp (1)(168, 1)(192) === [192, 168, 1, 1]
        );

    }),
    
    fp.it('uncurry test', function () {
    
        var cadd = function (x) {
            return function (y) {
                return function (z) {
                    return x + y + z;
                };
            };
        };
        var add = fp.uncurry (cadd);
    
        return (
            cadd (1)(2)(3) === add (1,2,3)
        );

    }),
    
    fp.it('times test', function () {
    
        var once = fp.times(1);
        var log  = once (function (msg) { 
            return msg; 
        });
        log ('JS Mola!');
        log ('JS Mola!');
 
        return (
            (log ('JS Mola!') === 'JS Mola!') &&
            (log ('JS Mola!') === void 0)
        );

    }),
    
    fp.it('maybe test', function () {
    
        var add   = function (x, y) { return x + y; };
        var mbadd = fp.maybe (add, 2);

        return (
            (mbadd (2, 3) === 5) &&
            (mbadd (3) === void 0)
        );

    }),
    
    fp.it('provided & expect test', function () {
    
        var add      = function (x, y) { return x + y;     };
        var positive = function (x, y) { return x * y > 0; };
        var padd     = fp.provided (positive)(add);
        var eadd     = fp.except (positive)(add);
        
        return (
            [padd (2, 3), padd (-2, 3)] === [5, undefined] &&
            [eadd (2, 3), eadd (-2, 3)] === [undefined, 1]
        );

    }),
    
    fp.it('forEach test', function () {
    
        var result = [];
        fp.forEach ([1 ,2, 3], function (item, idx) {
            result.push(item * item);
        });
 
        return (
            result === [1, 4, 9]
        );

    }),
    
    fp.it('reduce test', function () {
    
        var result = fp.reduce ([1,2,3], function (a, e) {
            return e + a;
        }, 0);

        return (
            result === 6
        );

    }),
    
    fp.it('rReduce test', function () {
    
        var result = fp.rReduce ([1,2,3], function (a, e) {
            return e + a;
        }, 0);

        return (
            result === 6
        );

    }),
    
    fp.it('map test', function () {
    
        var result = fp.map ([1,2,3], function (a, e) {
            return e + a;
        }, 0);

        return (
            result === [1, 4, 9]
        );

    }),
    
    fp.it('filter test', function () {
    
        var result = fp.filter([1,2,3], function (e){
            return e % 2 !== 0; 
        });

        return (
            result === [1, 3]
        );

    }),
    
    fp.it('every & some test', function () {
    
        var p = function (e) { return e < 4; };

        return (
            fp.every ([1,2,3], p) &&
            fp.some  ([1,2,3], p)
        );

    }),
    
    fp.it('compose & sequence test', function () {
    
        var clean = function (s) { return s.trim();     };
        var words = function (s) { return s.split(' '); };
        var count = function (s) { return s.length;     };
        
        return (
            (fp.compose (count, 
              fp.compose (words, 
                        clean))('NodeJS Mola') === 2) &&
            (fp.sequence ([
                clean,
                words,
                count
            ])('La FP en JS Mola') === 5)
        );

    }),
    
    fp.it('composeBreak & sequenceBreak test', function () {
    
        var grt = function (y) { return function (x) { if (x > y) return x; }; };
        var sqr = function (x) { return x * x ; };
        var inc = function (x) { return x + 1 ; };
       
        var c = fp.composeBreak  (sqr, grt (3));
        var s = fp.sequenceBreak ([sqr, grt (10), inc]);

        return (
            ([c(3), c(4)] === [undefined, 16]) &&
            ([s(3), s(4)] === [undefined, 17])
        );
        
    }),
    
    fp.it('tap test', function () {
    
        var add = function (x, y) { return x + y; };
        var sub = function (x, y) { return x - y; };
        var mul = function (x, y) { return x * y; };
        var div = function (x, y) { return x / y; };
        
        var data = fp.tap ([8,4]);
        
        return (
            (data(add) === 12) &&
            (data(sub) === 4)  &&
            (data(mul) === 32) &&
            (data(div) === 2)
        );
        
    }),
    
    fp.it('{map, reduce, filter, every, some}With test', function () {
    
        var sqr = function (x)    { return x * x;       };
        var odd = function (x)    { return x % 2 === 0; };
        var add = function (x, y) { return x + y;       };
        
        var mapWithSqr    = fp.mapWith (sqr);
        var reduceWithAdd = fp.reduceWith (add, 0);
        var filterWithOdd = fp.filterWith (odd);
        var everyWithOdd  = fp.everyWith (odd);
        var someWithOdd   = fp.someWith (odd);
                
        return (
            (mapWithSqr    ([1,2,3]) === [1, 4, 9]) &&
            (reduceWithAdd ([1,2,3]) === 6)         &&
            (filterWithOdd ([1,2,3]) === [1,3])     &&
            everyWithOdd   ([1,3,5])                &&
            someWithOdd    ([1,2,3])
        );
        
    }),
    
    fp.it('{get & pluck}With test', function () {
    
        var accounts = [
            { name: 'jvelez', free: 123 },
            { name: 'eperez', free: 315 },  
            { name: 'jlopez', free: 23  },  
            { name: 'jruiz' , free: 65  }  
        ];
        var free = fp.pluckWith ('free');
        var user = fp.getWith ('free');

        return (
            (user ('jvelez') === 123) &&
            (free (accounts) === [123,315,23,65])
        );
        
    }),
    
    fp.it('{compose & sequence}With test', function () {
        
        var data = fp.pull (function (x) { return x + 1; });
        var neg  = function neg(x) { return -x;    };
        var sqr  = function sqr(x) { return x * x; };
        
        var c = fp.composeWith (neg, sqr, data);
        var s = fp.sequenceBreakWith ([ 
            neg, sqr 
        ], data);

        return (
            ([c(), c(), c()] === [-1, -4, -9]) &&
            ([s(), s(), s()] === [-1, -4, -9])
        );
            
    }),
    
    fp.it('{compose & sequence}BreakWith test', function () {
        
        var data = fp.pull (function (x) { return x + 1; });
        
        var grt = function (y) { return function (x) { if (x > y) return x; }; };
        var sqr = function (x) { return x * x ; };
        var inc = function (x) { return x + 1 ; };
       
        var c = fp.composeBreakWith  (sqr, grt (3), data);
        var s = fp.sequenceBreakWith ([sqr, grt (10), inc], data);

        return (
            ([c(), c()] === [undefined, 16]) &&
            ([s(), s()] === [undefined, 17])
        );
            
    }),
    
    fp.it('overload test', function () {
        
        var add = fp.overload(
            function (x)       { return x; },
            function (x, y)    { return x + y; },
            function (x, y, z) { return x + y + z; } 
        );

        return (
            (add (2)     === 2) &&
            (add (2,3)   === 5) &&
            (add (2,3,5) ===10)
        );
            
    }),
    
    fp.it('cases-when test', function () {
        
        var equals = fp.curry (function (x, y) { 
           return x === y; 
        });

        var fib = fp.cases (
            fp.when (equals (0), function (n) {return 1; }),
            fp.when (equals (1), function (n) {return 1; }),
            function (n) { return fib (n-1) + fib (n-2); }
        );

        return (
            fib (5) === 8
        );
            
    }),
    
    fp.it('describe-it test', function () {
        
        var suite = fp.describe ('Test Suite')(
            fp.it ('test 1', function () {
                return 2 + 3 === 5;
            }),
            fp.it ('test 2', function () {
                return 2 - 3 === 5;
            })
        );

        return (
            fp.pluckWith ('result')(suite.result) === [true, false]
        );
            
    }),

    fp.it('pull test', function () {
        
        var inc = function (x) { return x + 1; };
        var dbl = function (x) { return 2 * x; };
        var s1 = fp.pull (inc);
        var s2 = fp.pull (dbl);

        return (
            ([s1(), s1(), s1()] === [0, 1, 2]) &&
            ([s2(), s2(), s2()] === [0, 2, 4]) 
        );
            
    }),

    fp.it('e{map, filter, reduce} test', function () {
        
        var inc = function (x) { return x + 1; };
        var odd = function (x) { return x % 2 === 0; };
        var add = function (x, y) { return x + y; };

        var emap    = fp.emap (inc);
        var ereduce = fp.emap (add, 0);
        var efilter = fp.emap (odd);

        return (
            (emap (2) === 3)    &&
            (ereduce (2) === 2) &&
            (ereduce (3) === 5) &&
            (efilter (2) === 2) &&
            (efilter (3) === void 0)
        );
            
    }),

    fp.it('fluent test', function () {
        
        var result;
        var add  = function (x, y) { return x + y; };
        var fadd = fp.fluent (function (data) {
            result = data;
        })(add);

        add (2, 3);

        return (
            result === 5
        );
            
    }),

    fp.it('pull Stream test', function () {
        
        var source = fp.pull (function (x) { return x + 1; }, 0);
        var stream = fp.pullStream (source)
            .map    (function (e)    { return e * e;     })
            .filter (function (e)    { return e % 2 === 0})
            .reduce (function (a, e) { return a + e;     }, 0)
            .end ();
        
        return (
            (stream.pull () === 0)  &&
            (stream.pull () === 4)  &&
            (stream.pull () === 20) &&
            (stream.pull () === 50)
        );
 
    })

);

fp.every (
    fp.pluckWith ('result')(tests.result), 
        function (result) {
            console.log (result);
        }
);