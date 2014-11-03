'use strict';

(function (/* Hanoi */) {
    
    function hanoi (n, origen, aux, destino) {
        if (n === 1) mover (origen, destino);  
        else {
            hanoi (n-1, origen, destino, aux);
            mover (origen, destino);
            hanoi (n-1, aux, origen, destino);
        }
    }
    function mover (origen, destino) {
        console.log (A, B, C);
        destino.push (origen.pop());
    }
    var A = [4, 3, 2, 1];
    var B = [];
    var C = [];
    hanoi (A.length, A, B, C);


})();
