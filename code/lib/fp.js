'use strict';

var fp = {};

fp.reverse = function reverse (fn) {

    return function () {
		var args  = [].slice.call(arguments);
		var iargs = [].concat(args).reverse();
		return fn.apply (this, iargs);
	};

};

fp.swap = function swap (fn, p) {

	return function () {
		var args = [].slice.call (arguments); 
		var temp = args[p[0]];
		args[p[0]] = args[p[1]];
		args[p[1]] = temp;
		return fn.apply(this, args);
	};

};

fp.arity = function arity (n) {

	return function (fn) {
		return function () {
			var args = [].slice.call(arguments, 0, n-1);
			return fn.apply(this, args);
		};
	};

};

fp.variadic = function variadic (fn) {

	return function () {
		var args = [].slice.call(arguments);
		var other = args.splice(0, fn.length-1);
		return fn.apply (this, other.concat([args]));
	};

};

fp.first = function first () {

	var fn = arguments [0];
	var params = [].slice.call (arguments, 1);
	return function () {
		var args = [].slice.call (arguments);
		return fn.apply (this, params.concat(args));
	};

};

fp.last = function last () {

	var fn = arguments [0];
	var params = [].slice.call (arguments, 1);
	return function () {
		var args = [].slice.call (arguments);
		return fn.apply (this, args.concat(params));
	};

};

fp.partial = function partial (fn) {

	return function (x) {
		return function (y) {
			return fn.call (this, x, y);
		};
	};

};

fp.rpartial = function rpartial (fn) {

	return function (x) {
		return function (y) {
			return fn.call (this, y, x);
		};
	};

};

fp.curry = function curry (fn) {

    return (function aux (args) {
        if (args.length >= fn.length) {
            return fn.apply (this, args);
        }
        else return function () {
            var nargs = [].slice.call(arguments);
            return aux(args.concat (nargs));
        };
    })([]);
    
};

fp.rcurry = function rcurry (fn) {

    return (function aux (args) {
        if (args.length >= fn.length) {
            return fn.apply (this, args);
        }
        else return function () {
            var nargs = [].slice.call(arguments);
            return aux(nargs.concat (args));
        };
    })([]);

};

fp.uncurry = function uncurry (fn) {

	return function () {
		var args = [].slice.call (arguments);
		return fp.reduce (args, function (ac, arg){
			return (ac = ac(arg));  
		}, fn);
	};

};

fp.times = function times (n) {

	return function (fn) {
		var times = 0;
		return function () {
			if (times < n) {
				times++;
				return fn.apply (this, arguments);
			}
		};
	};

};

fp.maybe = function maybe (fn) {

	return function () {
		var args = [].slice.call (arguments);
		var callable = (arguments.length >= fn.length) &&
			fp.every(args, function (p) {
				return (p !== null);
			});
		if (callable) return fn.apply (this, args);
	};

};

fp.before = function before (dn) {

	return function (fn) {
		return function () {
			dn.apply (this, arguments);
			return fn.apply (this, arguments);
		};
	};

};

fp.after = function after (dn) {

	return function (fn) {
		return function () {
			var r = fn.apply(this, arguments);
			dn.apply(this, arguments);
			return r;
		};
	};

};

fp.around = function around (dn) {

	return function (fn) {
		return function () {
			var args = [].slice.call(arguments);
			args = [dn.bind(this)].concat(args);
			return fn.apply (this, args);
		};
	};

};

fp.provided = function provided (pn) {

	return function (fn) {
		return function () {
			if (pn.apply(this, arguments))
				return fn.apply(this, arguments);
		};
	};

};

fp.except = function except (pn) {

	return function (fn) {
		return function () {
			if (!pn.apply(this, arguments))
				return fn.apply(this, arguments);
		};
	};

};

fp.forEach = function forEach (data, fn, self) {

	(function aux (data, index, fn) {
		fn.call(self, data[index], index, data);
		if (index < data.length - 1) 
			aux(data, index + 1, fn);
	})(data, 0, fn);

};

fp.reduce = function reduce (data, fn, base, self) {

	var ac = base;
	fp.forEach(data, function(e, i, data) {
		ac = fn.call(self, ac, data[i], i, data);
		}, self);
	return ac;

};

fp.rReduce = function rReduce (data, fn, base, self) {

   var iData= [].concat(data).reverse();
   return fp.reduce(iData, fn, base, self);

};

fp.map = function map (data, fn, self) {

	return fp.reduce (data, function (ac, item) {
		return ac.concat (fn.call (self, item));
	}, [], self);

};

fp.filter = function filter (data, fn, self) {

	return fp.reduce(data, function (ac, e, i, data) {
		if (fn.call (self, e, i, data)) 
			ac.push (e);
		return ac;
	}, [], self);

};

fp.every = function every (data, fn, self) {

	return fp.reduce (data, function (ac, e, i, data) {
		return ac && fn.call(self, e, i, data);
	}, true, self);

};

fp.some = function some(data, fn, self) {

	return fp.reduce (data, function (ac, e, i, data) {
			return ac || fn.call(self, e, i, data);
	}, false, self);

};

fp.compose = function compose (fn, gn) {

    return function (x) {
        return fn(gn(x));
    };

};

fp.sequence = function sequence (fns) {

	return function (x) {
		return fp.reduce (fns, function (ac, fn) {
			return fn(ac);
		}, x);
	};

};

fp.composeBreak = function composeBreak (fn, gn) {

	return function (x) {
		var r = gn(x);  
		return (r !== void 0) ? fn(r) : void 0;
	};

};

fp.sequenceBreak = function sequenceBreak (fns) {

	return function (x) {
		return fp.reduce (fns, function (ac, fn) {
			return (ac !== void 0) ? fn(ac) : void 0; 
		}, x);
	};

};

fp.tap = function tap (args) {

    return function (fn) {
        return fn.apply(this, args);
    };

};

fp.doWith = function doWith (fn) {

	return function (hn) {
		return function () {
			var args = [].slice.call(arguments);
			args.splice (1, 0, hn);
			return fn.apply(this, args);
		};
	};

};

fp.mapWith    = fp.doWith (fp.map);
fp.reduceWith = fp.doWith (fp.reduce);
fp.filterWith = fp.doWith (fp.filter);
fp.everyWith  = fp.doWith (fp.every);
fp.someWith   = fp.doWith (fp.some);

fp.flip = function flip (fn) {

	return function () {
		var args = [].slice.call (arguments);
		return function (second) {
			return fn.apply(second, args);
		};
	};

};

fp.getWith = function getWith (attribute) {

    return function (object) {
        return object[attribute];
    };

};

fp.pluckWith = function pluckWith (attribute) {

    return fp.mapWith(fp.getWith(attribute));

};

fp.composeWith = function composeWith (fn, gn, beg) {

    return function () {
        return fn(gn(beg()));
    };

};

fp.sequenceWirh = function sequenceWith (fns, beg) {

	return function () {
		return fp.reduce (fns, function (ac, fn) {
			return fn(ac);
		}, beg());
	};

};

fp.composeBreakWith = function composeBreakWith (fn, gn, beg) {

  return function () {
    var r = gn(beg());
    return (r !== void 0) ? fn(r) : void 0;
  }; 

};

fp.sequenceBreakWith = function sequenceBreakWith (fns, beg) {

	return function () {
		return fp.reduce(fns, function (ac, fn) { 
			return (ac !== void 0) ? fn(ac) : void 0; 
		}, beg());  
	}; 

};

fp.overload = function overload () {

	var fns = [].slice.call(arguments);
	return function () {
		var args = [].slice.call (arguments);
		var fn = fp.filter (fns, function (fn) {
			return fn.length === args.length;
		})[0];
		if (fn) return fn.apply (this, args);
	};

};

fp.when = function when (guard, fn) {

	return function () {
	if (guard.apply(this, arguments))
		return fn.apply (this, arguments);
	};

};

fp.cases = function cases () {

	var fns = [].slice.call (arguments);
	return function () { 
		var result;
		var args = [].slice.call (arguments);
		fp.forEach(fns, function (fn) {
			if (result !== void 0) 
				result = fn.apply (this, args);
		}, this);
	return result;
	};

};

fp.it = function it (test, fn) {

	return function () {
		return {
			test   : test,
			result : fn.apply(this, arguments)
		};
	};

};

fp.describe = function describe (suite) {

	return function () { 
		var its = [].slice.call(arguments);
		var results = fp.map (its, function (it){
			return it.apply (this, arguments);
		}, this);
		return {
			suite  : suite,
			result : results
		}; 
	};

};

fp.time = function time (fn) {
    
    return function () {
        var before = Date.now();
        var result = fn.apply(this, arguments);
        var after  = Date.now();
        return {
            value : result,
            time  : (after - before)
        };
    };
    
};

fp.memoize = function memoize (fn) {
	var cache = {}; 
	var mfn = function () {
	var args = [].slice.call (arguments); 
	var key  = JSON.stringify(args);
	return key in cache ? 
		cache[key] :
		cache[key] = fn.apply(this, args);
	};
	return mfn;
};

fp.trampoline = function trampoline (fn) {

	return function () { 
		var result = fn.apply (this, arguments);    
		while (result instanceof Function)
			result = result();
		return result;
	};

};

fp.delay = function delay (fn, ms) {

	return function () {
		var args = [].slice.call(arguments);
		setTimeout (function () {
			fn.apply (this, args);
		}.bind(this), ms);
	};

};

fp.async = function async (fn)  {

    return fp.delay (fn, 0);

};

fp.forever = function forever (fn, ms) {

	return function () {
		var args = [].slice.call(arguments);
		setInterval (function () {
			fn.apply (this, args);
		}.bind(this), ms); 
	};

};

fp.retry = function retry (fn, n, ms) {

	var idx = 0;
	return function aux () {
		var r = fn.apply(this, arguments);
		if (idx < n && !r) {
			r = fp.delay (fn, ms)
					.apply(this, arguments); idx++; }
		return r;
	}; 

};

fp.pull = function pull(fn, base) {
    
    var idx = base || 0;
    return function () {
        return fn.call (this, idx++); 
    };
    
};

fp.push = function push (fn, ms) {
    
    return function (cb) {
        var source = fp.pull (fn);
        setInterval (function () {
            cb(source());
        }, ms || 1000);   
    };
    
};

fp.ereduce = function eReduce (fn, b) {
    
    var ac = b;
    return function () {
        var args = [].slice.call (arguments);
        ac = fn.apply (this, [ac].concat(args));
        return ac;
    };
    
};

fp.emap = function emap (fn) { 
    
    return function () {
        return fn.apply (this, arguments);
    };
    
};

fp.efilter = function efilter (fn) {
    
    return function () { 
        var out = fn.apply (this, arguments);
        if (out) return arguments[0];
    };
    
};

fp.fluent = function fluent (hn) {
    
    var cb = hn || function () {};
    return function (fn) {
        return function () {
            cb (fn.apply (this, arguments));
            return this;
        };
    };
    
};

fp.pullStream = function pullStream (source) {
    
    var fns = [];
    var define = fp.fluent (function (fn) {
         fns.push (fn);
    });
    var next = function (fns, beg) {
        var result = fp.sequenceBreakWith (fns, beg)();
        return result ? result : next (fns, beg);  
    };
    return {
        map   : define (fp.emap),
        filter: define (fp.efilter),
        reduce: define (fp.ereduce),
        end   : function () {
            return {
                pull: function () {
                   return next (fns, source); 
                }
            };
        }
    };
    
};

fp.pushStream = function pushStream (source) {
    
    var fns = [];
    var lns = [];
    var define = fp.fluent (function (fn) {
         fns.push (fn);
    });
    return {
        map   : define (fp.emap),
        filter: define (fp.efilter),
        reduce: define (fp.ereduce),
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
    
};

module.exports = fp;




