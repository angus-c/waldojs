(function (global) {
  function dealWithIt(util, expected, searchTerm, options) {
    // integrity check arguments
    (!expected || typeof searchTerm == expected)
      ? traverse(util, searchTerm, options)
      : console.error(searchTerm + ' must be ' + expected);
  }

  function traverse(util, searchTerm, options) {
    util = tests[util] || util;
    options || (options = {});

    var data;
    var alreadySeen;

    var obj = options.obj || global;
    var ownProp = options.hasOwnProperty;
    var path = options.path || ((obj == global) ? 'global' : '');
    var queue = [{ 'obj': obj, 'path': path }];
    var seen = [];

    // a non-recursive solution to avoid call stack limits
    // http://www.jslab.dk/articles/non.recursive.preorder.traversal.part4
    while ((data = queue.pop())) {
      obj = data.obj;
      path = data.path;

      for (var prop in obj) {
        // IE may throw errors when accessing/coercing some properties
        try {
          if (ownProp.call(obj, prop)) {
            // inspect objects
            if ([obj[prop]] == '[object Object]') {
              // check if already searched (prevents circular references)
              for (
                var i = -1;
                seen[++i] && !(alreadySeen = like(seen[i].obj, obj[prop]) && seen[i]);
              );
              // add to stack
              if (!alreadySeen) {
                data = { 'obj': obj[prop], 'path': path + '.' + prop };
                queue.push(data);
                seen.push(data);
              }
            }
            // if match detected, log it
            if (util(searchTerm, obj, prop)) {
              console.log(
                path + '.' + prop,
                '->',
                '(' + (alreadySeen ? '<' + alreadySeen.path + '>' : typeof obj[prop]) + ')',
                obj[prop]);
            }
          }
        } catch(e) { }
      }
    }
  }

  // based on http://stackoverflow.com/a/6713782
  function like(x, y) {
    if (x === y) {
      return true;
    }
    if (!(x instanceof Object) || !(y instanceof Object)) {
      return false;
    }
    if (x.constructor !== y.constructor) {
      return false;
    }
    for (var p in x) {
      if (!x.hasOwnProperty(p)) continue;
      if (!y.hasOwnProperty(p)) {
        return false;
      }
      if (x[p] === y[p]) continue;
      if (typeof x[p] != 'object') {
        return false;
      }
      if (!like(x[p], y[p])) {
        return false;
      }
    }
    for (p in y) {
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
        return false;
      }
    }
  }

  var tests = {
    'propName': function (searchTerm, obj, prop) {
      return searchTerm == prop;
    },
    'type': function (searchTerm, obj, prop) {
      return obj[prop] instanceof searchTerm;
    },
    'value': function (searchTerm, obj, prop) {
      return obj[prop] === searchTerm;
    },
    'valueCoerced': function (searchTerm, obj, prop) {
      return obj[prop] == searchTerm;
    }
  };

  // expose
  global.find = {
    'byName': function (searchTerm, options) {
      dealWithIt('propName', 'string', searchTerm, options);
    },
    'byType': function (searchTerm, options) {
      dealWithIt('type', 'function', searchTerm, options);
    },
    'byValue': function (searchTerm, options) {
      dealWithIt('value', null, searchTerm, options);
    },
    'byValueCoerced': function (searchTerm, options) {
      dealWithIt('valueCoerced', null, searchTerm, options);
    },
    'custom': function (fn, options) {
      traverse(fn, null, options);
    }
  };
})(window || global);
