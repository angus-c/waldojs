'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var GLOBAL = typeof window == 'object' ? window : global;

var find = {
  byName: function byName(what, where) {
    return this.searchMaybe('propName', 'string', what, where);
  },
  byType: function byType(what, where) {
    return this.searchMaybe('type', 'function', what, where);
  },
  byValue: function byValue(what, where) {
    return this.searchMaybe('value', null, what, where);
  },
  byValueCoerced: function byValueCoerced(what, where) {
    return this.searchMaybe('valueCoerced', null, what, where);
  },
  custom: function custom(fn, where) {
    return this.searchMaybe(fn, null, where);
  },
  searchMaybe: function searchMaybe(util, expected, what, where) {
    // integrity check arguments
    if (expected && typeof what != expected) {
      throw new Error('' + what + ' must be ' + expected);
    }
    // only console.log if we are the global function
    if (this === GLOBAL.waldo) {
      GLOBAL.DEBUG = true;
    }
    return search(util, what, where);
  }
};

function search(util, what) {
  var where = arguments[2] === undefined ? GLOBAL : arguments[2];

  util = searchBy[util] || util;

  var data = undefined;
  var alreadySeen = undefined;

  var path = where == GLOBAL ? 'GLOBAL' : 'SRC';
  var queue = [{ where: where, path: path }];
  var seen = [];

  var matches = [];

  // a non-recursive solution to avoid call stack limits
  // http://www.jslab.dk/articles/non.recursive.preorder.traversal.part4
  while (data = queue.pop()) {
    var _where = data.where;
    var _path = data.path;

    for (var prop in _where) {
      // IE may throw errors when accessing/coercing some properties
      try {
        if (_where.hasOwnProperty(prop)) {
          // inspect whereects
          if ([_where[prop]] == '[object Object]') {
            // check if already searched (prevents circular references)
            for (var i = -1; seen[++i] && !(alreadySeen = like(seen[i].where, _where[prop]) && seen[i]););
            // add to stack
            if (!alreadySeen) {
              data = { 'where': _where[prop], 'path': '' + _path + '.' + prop };
              queue.push(data);
              seen.push(data);
            }
          }
          // if match detected, push it.
          if (util(what, _where, prop)) {
            var type = alreadySeen ? '<' + alreadySeen.path + '>' : typeof _where[prop];
            var match = new Match({ path: _path, where: _where, prop: prop, type: type });
            matches.push(match);
            GLOBAL.DEBUG && match.log();
          }
        }
      } catch (e) {}
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
  propName: function propName(what, where, prop) {
    return what == prop;
  },
  type: function type(what, where, prop) {
    return where[prop] instanceof what;
  },
  value: function value(what, where, prop) {
    return where[prop] === what;
  },
  valueCoerced: function valueCoerced(what, where, prop) {
    return where[prop] == what;
  }
};

var Match = (function () {
  function Match(props) {
    _classCallCheck(this, Match);

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
      var where = this.where;
      var prop = this.prop;

      return where[prop];
    }
  }, {
    key: 'log',
    value: function log() {
      console.log(this.toString());
    }
  }]);

  return Match;
})();

// for console running
GLOBAL.waldo = _Object$assign({}, find, { debug: true });

exports['default'] = find;
module.exports = exports['default'];