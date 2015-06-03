'use strict';

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = find = {
  byName: function byName(searchTerm, options) {
    dealWithIt('propName', 'string', searchTerm, options);
  },
  byType: function byType(searchTerm, options) {
    dealWithIt('type', 'function', searchTerm, options);
  },
  byValue: function byValue(searchTerm, options) {
    dealWithIt('value', null, searchTerm, options);
  },
  byValueCoerced: function byValueCoerced(searchTerm, options) {
    dealWithIt('valueCoerced', null, searchTerm, options);
  },
  custom: function custom(fn, options) {
    traverse(fn, null, options);
  }
};

function dealWithIt(util, expected, searchTerm, options) {
  // integrity check arguments
  !expected || typeof searchTerm == expected ? traverse(util, searchTerm, options) : console.error(searchTerm, ' must be ', expected);
}

function traverse(util, searchTerm) {
  var _ref = arguments[2] === undefined ? {} : arguments[2];

  var _ref$obj = _ref.obj;
  var obj = _ref$obj === undefined ? window || global : _ref$obj;
  var path = _ref.path;

  util = tests[util] || util;

  var data = undefined;
  var alreadySeen = undefined;

  path || (path = obj == global ? 'global' : '');
  var queue = [{ obj: obj, path: path }];
  var seen = [];

  // a non-recursive solution to avoid call stack limits
  // http://www.jslab.dk/articles/non.recursive.preorder.traversal.part4
  while (data = queue.pop()) {
    var _obj = data.obj;
    var _path = data.path;

    for (var prop in _obj) {
      // IE may throw errors when accessing/coercing some properties
      try {
        if (_obj.hasOwnProperty(prop)) {
          // inspect objects
          if ([_obj[prop]] == '[object Object]') {
            // check if already searched (prevents circular references)
            for (var i = -1; seen[++i] && !(alreadySeen = like(seen[i].obj, _obj[prop]) && seen[i]););
            // add to stack
            if (!alreadySeen) {
              data = { 'obj': _obj[prop], 'path': '' + _path + '.' + prop };
              queue.push(data);
              seen.push(data);
            }
          }
          // if match detected, log it
          if (util(searchTerm, _obj, prop)) {
            var type = alreadySeen ? '<' + alreadySeen.path + '>' : typeof _obj[prop];
            console.log('' + _path + '.' + prop + ' -> (' + type + ') ' + _obj[prop]);
          }
        }
      } catch (e) {}
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
  propName: function propName(searchTerm, obj, prop) {
    return searchTerm == prop;
  },
  type: function type(searchTerm, obj, prop) {
    return obj[prop] instanceof searchTerm;
  },
  value: function value(searchTerm, obj, prop) {
    return obj[prop] === searchTerm;
  },
  valueCoerced: function valueCoerced(searchTerm, obj, prop) {
    return obj[prop] == searchTerm;
  }
};
module.exports = exports['default'];