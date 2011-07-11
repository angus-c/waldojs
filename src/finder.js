(function(window) {

  function dealWithIt(util, expected, searchTerm, options) {
    (!expected || typeof searchTerm == expected)
      ? traverse(util, searchTerm, options)
      : console.error(searchTerm + ' must be ' + expected);
  }

  function traverse(util, searchTerm, options) {
    options || (options = {});
    var pair;
    var obj = options.obj || window;
    var ownProp = options.hasOwnProperty;
    var path = options.path || ((obj == window) ? 'window' : '');
    var pairs = [[obj, path]];

    // a non-recursive solution to avoid stack overflows
    // http://www.jslab.dk/articles/non.recursive.preorder.traversal.part4
    while ((pair = pairs.pop())) {
      obj = pair[0];
      path = pair[1];
      for (var prop in obj) {
        // IE may throw errors when accessing/coercing some properties
        try {
          if (ownProp.call(obj, prop)) {
            if ((tests[util] || util)(searchTerm, obj, prop)){
              console.log(path + '.' + prop, '->', '(' + (typeof obj[prop]) + ')', obj[prop]);
              return;
            }
            if([obj[prop]] == '[object Object]' && (obj[prop] != obj)) {
              pairs.push([obj[prop], path + '.' + prop]);
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