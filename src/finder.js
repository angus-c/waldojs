(function(window) {

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
    var pool;
    var pooled;
    var prevPath;

    var obj = options.obj || window;
    var ownProp = options.hasOwnProperty;
    var path = options.path || ((obj == window) ? 'window' : '');
    var queue = [{ 'obj': obj, 'path': path }];

    // a non-recursive solution to avoid call stack limits
    // http://www.jslab.dk/articles/non.recursive.preorder.traversal.part4
    while ((data = queue.pop())) {
      obj = data.obj;
      path = data.path;
      pooled = false;

      // clear pool when switching root properties
      path.indexOf(prevPath) && (pool = [data]);
      prevPath = path;

      for (var prop in obj) {
        // IE may throw errors when accessing/coercing some properties
        try {
          if (ownProp.call(obj, prop)) {
            // inspect objects
            if ([obj[prop]] == '[object Object]') {
              // check if already pooled (prevents circular references)
              for (var i = -1; pool[++i] && !(pooled = pool[i].obj == obj[prop] && pool[i]); ) { }
              // add to stack
              if (!pooled) {
                data = { 'obj': obj[prop], 'path': path + '.' + prop };
                pool.push(data);
                queue.push(data);
              }
            }
            // if match detected, log it
            if (util(searchTerm, obj, prop)) {
              console.log(path + '.' + prop, '->', '(' + (pooled ? '<' + pooled.path + '>' : typeof obj[prop]) + ')', obj[prop]);
            }
          }
        } catch(e) { }
      }
    }
  }

  var tests = {
    'propName': function(searchTerm, obj, prop) {
      return searchTerm == prop;
    },
    'type': function(searchTerm, obj, prop) {
      return obj[prop] instanceof searchTerm;
    },
    'value': function(searchTerm, obj, prop) {
      return obj[prop] === searchTerm;
    },
    'valueCoerced': function(searchTerm, obj, prop) {
      return obj[prop] == searchTerm;
    }
  };

  // expose
  window.find = {
    'byPropName': function(searchTerm, options) {
      dealWithIt('propName', 'string', searchTerm, options);
    },
    'byType': function(searchTerm, options) {
      dealWithIt('type', 'function', searchTerm, options);
    },
    'byValue': function(searchTerm, options) {
      dealWithIt('value', null, searchTerm, options);
    },
    'byValueCoerced': function(searchTerm, options) {
      dealWithIt('valueCoerced', null, searchTerm, options);
    },
    'custom': function(fn, options) {
      traverse(fn, null, options);
    }
  };
}(this));