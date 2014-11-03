'use strict';

var fp = require ('../lib/fp');

(function (/* Stream Programming. Pull */) {
    
    function Stream () {
        var fns = [];
        var define = fluent (function (fn) {
            fns = [fn].concat (fns);
        });
        var next = function (fns, beg) {
            var result = sequenceBreakWith (fns, beg)();
            return result ? result : next (fns, beg);  
        };
        
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
                return {
                    pull: function () {
                        return next (fns, source);
                    }
                };
            }
        };
    }
    
    var source = fp.pull (function (x) { return x + 1; }, 0);
    var stream = fp.pullStream (source)
        .map    (function sqr(e)    { return e * e;     })
        .filter (function evn(e)    { return e % 2 === 0})
        .reduce (function add(a, e) { return a + e;     }, 0)
        .end ();
    console.log (
        stream.pull (),
        stream.pull (),
        stream.pull (),
        stream.pull ()
    );


})(fp);