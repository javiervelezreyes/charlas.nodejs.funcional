'use strict';

var fp = require ('../lib/fp');

(function (/* Stream Programming. Push */) {
    
    function Stream (source) {
        var fns = [];
        var lns = [];
        var define = fp.fluent (function (fn) {
             fns.push (fn);
        });
        return {
            map: define (
                function (fn) { 
                    return function () {
                        var r = fn.apply (this, arguments);
                        return r;
                    };
                }),
            filter: define (
                function (fn) {
                    return function () { 
                        var r = fn.apply (this, arguments);
                        if (r) return arguments[0];
                    };
                }),
            reduce: define ( 
                function (fn, b) {
                    var r = b;
                    return function () {
                        var args = [].slice.call (arguments);
                        r = fn.apply (this, [r].concat(args));
                        return r;
                    };
                }),
            end: function () {
                var sequence = fp.sequenceBreak(fns);
                source(function (data) {
                    var result = sequence(data);
                    lns.forEach(function (ln) {
                       if (result) ln (result); 
                    });
                });
                return {
                    listen: function (ln) {
                       lns.push(ln);
                    }
                };
            }
        };
    }
    
    var source = fp.push (function (x) { return x + 1; });
    var stream = fp.pushStream (source)
        .map    (function (e)    { return e * e;     })
        .filter (function (e)    { return e % 2 === 0})
        .reduce (function (a, e) { return a + e;     }, 0)
        .end ();
        
    stream.listen (console.log);

})(fp);