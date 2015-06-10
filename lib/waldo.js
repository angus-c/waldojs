'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var GLOBAL = typeof window == 'object' ? window : global;

exports['default'] = {
  byName: function byName(searchTerm, options) {
    return searchMaybe('propName', 'string', searchTerm, options);
  },
  byType: function byType(searchTerm, options) {
    return searchMaybe('type', 'function', searchTerm, options);
  },
  byValue: function byValue(searchTerm, options) {
    return searchMaybe('value', null, searchTerm, options);
  },
  byValueCoerced: function byValueCoerced(searchTerm, options) {
    return searchMaybe('valueCoerced', null, searchTerm, options);
  },
  custom: function custom(fn, options) {
    return searchMaybe(fn, null, options);
  },
  debug: function debug(enabled) {
    GLOBAL.DEBUG = enabled;
  }
};

function searchMaybe(util, expected, searchTerm, options) {
  // integrity check arguments
  if (!expected || typeof searchTerm == expected) {
    return search(util, searchTerm, options);
  }
  console.error(searchTerm, ' must be ', expected);
}

function search(util, searchTerm) {
  var _ref = arguments[2] === undefined ? {} : arguments[2];

  var _ref$obj = _ref.obj;
  var obj = _ref$obj === undefined ? GLOBAL : _ref$obj;
  var path = _ref.path;

  util = searchBy[util] || util;

  var data = undefined;
  var alreadySeen = undefined;

  path || (path = obj == GLOBAL ? 'GLOBAL' : '');
  var queue = [{ obj: obj, path: path }];
  var seen = [];

  var matches = [];

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
            var match = new Match({ path: _path, obj: _obj, prop: prop, type: type });
            matches.push(match);
            GLOBAL.DEBUG && console.log(match.log());
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }
  }

  return matches;
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

var searchBy = {
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

var Match = (function () {
  function Match(props) {
    _classCallCheck(this, Match);

    debugger;
    _Object$assign(this, props);
  }

  _createClass(Match, [{
    key: 'toString',
    value: function toString() {
      var path = this.path;
      var prop = this.prop;
      var type = this.type;

      return '' + path + '.' + prop + ' -> (' + type + ') ' + this.getValue();
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      var obj = this.obj;
      var prop = this.prop;

      return obj[prop];
    }
  }, {
    key: 'log',
    value: function log() {
      console.log(this.toString());
    }
  }]);

  return Match;
})();

module.exports = exports['default'];