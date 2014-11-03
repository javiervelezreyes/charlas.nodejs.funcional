'use strict';

var fp = require ('../lib/fp');

(function (/* Fibonacci no memoizado */) {

    var fib = function (n) {
        if (n < 2) return n;
        else return fib(n-1) + fib(n-2);
    };
    var tfib = fp.time (fib);

    console.log (
        tfib(43)
    );


})(fp);

(function ( /* Fibonacci memoizado */) {

    var fib = function (n) {
        if (n < 2) return n;
        else return fib(n-1) + fib(n-2);
    };

    var fib  = fp.memoize(fib);
    var tfib = fp.time (fib);

    console.log (
        tfib(43)
    );

})(fp);