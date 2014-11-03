'use strict';

(function (/* Map-Reduce */) {

    var dataset = [
        { age: 17, contacts: 67 }, { age: 27, contacts: 50 }, { age: 33, contacts: 34 },
        { age: 32, contacts: 45 }, { age: 17, contacts: 72 }, { age: 12, contacts: 87 },
        { age: 54, contacts: 34 }, { age: 24, contacts: 22 }, { age: 15, contacts: 65 },
        { age: 23, contacts: 12 }, { age: 17, contacts: 56 }, { age: 17, contacts: 43 },
        { age: 12, contacts: 67 }, { age: 15, contacts: 45 }, { age: 15, contacts: 98 },
        { age: 16, contacts: 45 }, { age: 17, contacts: 78 }, { age: 45, contacts: 49 },
        { age: 24, contacts: 23 }, { age: 16, contacts: 34 }, { age: 24, contacts: 83 },
        { age: 55, contacts: 45 }, { age: 23, contacts: 89 }, { age: 17, contacts: 45 },
        { age: 30, contacts: 78 }, { age: 44, contacts: 23 }, { age: 16, contacts: 65 },
        { age: 16, contacts: 89 }, { age: 22, contacts: 67 }, { age: 17, contacts: 55 }
    ];
    
    function split (dataset, n) {
        var results = [];
        dataset.forEach (function (item, index) {
            var batch = index % n;
            if (results[batch]) results[batch].push(item);
            else results[batch] = [item];
        });
        return results;
    }
    function map (batch) {
        return batch.map (function (item) {
            return {
                age      : item.age,
                contacts : item.contacts,
                count    : 1
            };
        });
    }
    function shuffle (dataset) {
        return dataset.reduce (function (ac, item) {
            var range = Math.floor (item.age / 10);
            if (!ac[range]) ac[range] = [];
            ac[range].push ({
                range    : range,
                age      : item.age,
                contacts : item.contacts,
                count    : item.count
            });
            return ac;
        }, []);
    }
    function reduce (batch) {
        return batch.reduce (function (ac, item) {
            ac.range     = item.range;
            ac.contacts += item.contacts;
            ac.count    += item.count;
            return ac;
        }, { contacts: 0, count: 0 });
    }
    function join (dataset) {
        return dataset.reduce (function (ac, batch) {
            ac.push ({
                range    : batch.range,
                contacts : batch.contacts,
                count    : batch.count,
                freq     : batch.contacts /  batch.count
            });
            return ac;
        }, []);
    }
    
    console.log (
        join (split (dataset, 3)
            .map (function (batch) {
                return map(batch);
            })
            .reduce (function (ac, batch, index, ds) {
                return (index < ds.length-1) ?
                    ac.concat (batch) :
                    [ac.concat (batch)];
            }, [])
            .reduce (function (ac, ds) {
                ac = shuffle (ds);
                return ac;
            }, [])
            .reduce (function (ac, batch) {
                ac.push (reduce (batch));
                return ac;
            }, [])
        )
    );

})();