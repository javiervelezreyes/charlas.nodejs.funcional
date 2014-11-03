'use strict';

(function (/* Reutilizacion Funcional */) {
    
    var get = function (collection) {
        return function (filter, reducer, base) {
            return collection
                .filter (filter)
                .reduce (reducer, base);
        };
    };


    (function ( /* Users */ ) {
        var users = [
            { name: 'jvelez', sex: 'M', age: 35 },
            { name: 'eperez', sex: 'F', age: 15 },
            { name: 'jlopez', sex: 'M', age: 26 }
        ];
        var adult = function (u) { return u.age > 18; };
        var names = function (ac, u) {
            ac.push (u.name);
            return ac;
        }; 
        console.log (
            get (users)(adult, names, [])
        );
    })();

    (function ( /* Basket */ ) {
        var basket = [
            { product: 'oranges', type: 'F', price:15 },
            { product: 'bleach' , type: 'H', price:15 },
            { product: 'pears'  , type: 'F', price:45 },
        ];
        var food  = function (p) { return p.type === 'F'; };
        var total = function (ac, p) {
            return ac + p.price;
        };
        console.log (
            get (basket)(food, total, 0)
        );
    })();
    
})();