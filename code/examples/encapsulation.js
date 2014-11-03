'use strict';

(function (/* Encapsulacion de Estado y Comportamiento */) { 
    
    (function (/* Estado  */) {
    
        function Stack () {
            var items   = [];
            var history = [];
            return {
                push: function (e) {
                    history.push([].concat(items));
                    items.push(e);   
                },
                pop: function () {
                    history.push([].concat(items));
                    return items.pop();
                },
                undo: function () {
                    if (history.length > 0) 
                        items = history.pop();     
                },
                data: function () {
                    return items;
                }
            };
        }
        
        var s = Stack ();
        s.push(1); console.log (s.data());
        s.push(2); console.log (s.data());
        s.push(3); console.log (s.data());
    
    })();
    
    (function (/* Comportamiento  */) {
    
        function Stack () {
            var items   = [];
            var history = [];
            return {
                push: function push (e) {
                    history.push(function(){items.pop()});
                    items.push(e);   
                },
                pop: function pop () {
                    var e = items.pop();
                    history.push(function(){items.push(e);});
                    return e;
                },
                undo: function undo() {
                    if (history.length > 0)
                       history.pop()();
                },
                data: function () {
                    return items;
                }
            }; 
        }
        
        var s = Stack ();
        s.push(1); console.log (s.data());
        s.push(2); console.log (s.data());
        s.push(3); console.log (s.data());
    
    })();
})();   
    