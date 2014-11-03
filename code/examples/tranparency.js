(function (/* Transparencia Referencial */) {

    (function (/* Stack Estilo OOP */) {
        
        function Stack () {
            var items = [];
            return {
                push: function (e) {
                    items.push(e);   
                },
                pop: function () {
                    return items.pop();
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


    (function (/* Stack Estilo Funcional */) {

        function Stack () {
            return { stack: [] };
        }
        function push (s, e) {    
            return {
                stack: s.stack.concat(e),
                top: e
            };
        }
        function pop (s) {
            var stack = [].concat(s.stack);
            var e = stack.pop();
            return {
                stack: stack,
                top: e
            };
        }
        
        var s = Stack ();
        push(s, 1); console.log (s);
        push(s, 2); console.log (s);
        push(s, 3); console.log (s);
        
        s = push(s, 1); console.log (s);
        s = push(s, 2); console.log (s);
        s = push(s, 3); console.log (s);

    })();

})();