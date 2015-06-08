module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _query = __webpack_require__(1);

	var _query2 = _interopRequireDefault(_query);

	var _match = __webpack_require__(2);

	var _match2 = _interopRequireDefault(_match);

	var global = window || global;

	exports['default'] = {
	  byName: function byName(searchTerm, options) {
	    searchMaybe('propName', 'string', searchTerm, options);
	  },
	  byType: function byType(searchTerm, options) {
	    searchMaybe('type', 'function', searchTerm, options);
	  },
	  byValue: function byValue(searchTerm, options) {
	    searchMaybe('value', null, searchTerm, options);
	  },
	  byValueCoerced: function byValueCoerced(searchTerm, options) {
	    searchMaybe('valueCoerced', null, searchTerm, options);
	  },
	  custom: function custom(fn, options) {
	    searchMaybe(fn, null, options);
	  },
	  debug: function debug(enabled) {
	    global.DEBUG = enabled;
	  }
	};

	function searchMaybe(util, expected, searchTerm, options) {
	  // integrity check arguments
	  !expected || typeof searchTerm == expected ? search(util, searchTerm, options) : console.error(searchTerm, ' must be ', expected);
	}

	function search(util, searchTerm) {
	  var _ref = arguments[2] === undefined ? {} : arguments[2];

	  var _ref$obj = _ref.obj;
	  var obj = _ref$obj === undefined ? global : _ref$obj;
	  var path = _ref.path;

	  util = searchBy[util] || util;

	  var data = undefined;
	  var alreadySeen = undefined;

	  path || (path = obj == global ? 'global' : '');
	  var queue = [{ obj: obj, path: path }];
	  var seen = [];

	  var query = new _query2['default'](util, searchTerm, path);

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
	            query.addMatch(new _match2['default']({ path: _path, obj: _obj, prop: prop, type: type }));
	            if (global.DEBUG) {
	              console.log('' + _path + '.' + prop + ' -> (' + type + ') ' + _obj[prop]);
	            }
	          }
	        }
	      } catch (e) {
	        console.warn(e);
	      }
	    }
	  }

	  return query;
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
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Query = (function () {
	  function Query(_ref) {
	    var searchBy = _ref.searchBy;
	    var searchTerm = _ref.searchTerm;
	    var path = _ref.path;

	    _classCallCheck(this, Query);

	    this.attrs = { searchBy: searchBy, searchTerm: searchTerm, path: path };
	    this.matches = [];
	  }

	  _createClass(Query, [{
	    key: 'toString',
	    value: function toString() {
	      var _attrs = this.attrs;
	      var searchBy = _attrs.searchBy;
	      var searchTerm = _attrs.searchTerm;

	      var searchByDescriptions = {
	        propName: 'by name',
	        type: 'by type',
	        value: 'by value',
	        valueCoerced: 'by value coerced',
	        custom: 'custom function'
	      };

	      searchBy = searchByDescriptions[searchBy] || searchByDescriptions['custom'];

	      return 'search ' + searchBy + ' for ' + searchTerm;
	    }
	  }, {
	    key: 'getMatches',
	    value: function getMatches() {
	      return this.matches;
	    }
	  }, {
	    key: 'addMatch',
	    value: function addMatch(match) {
	      this.matches.push(match);
	    }
	  }, {
	    key: 'log',
	    value: function log() {
	      console.log(this);
	    }
	  }]);

	  return Query;
	})();

	exports['default'] = Query;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Match = (function () {
	  function Match(_ref) {
	    var path = _ref.path;
	    var obj = _ref.obj;
	    var prop = _ref.prop;
	    var type = _ref.type;

	    _classCallCheck(this, Match);

	    this.attrs = { path: path, obj: obj, prop: prop, type: type, value: obj[prop] };
	  }

	  _createClass(Match, [{
	    key: "toString",
	    value: function toString() {
	      var _attrs = this.attrs;
	      var path = _attrs.path;
	      var prop = _attrs.prop;
	      var type = _attrs.type;
	      var value = _attrs.value;

	      return "" + path + "." + prop + " -> (" + type + ") " + value;
	    }
	  }, {
	    key: "getValue",
	    value: function getValue() {
	      var _attrs2 = this.attrs;
	      var obj = _attrs2.obj;
	      var prop = _attrs2.prop;

	      return obj[prop];
	    }
	  }, {
	    key: "log",
	    value: function log() {
	      console.log(this);
	    }
	  }]);

	  return Match;
	})();

	exports["default"] = Match;
	module.exports = exports["default"];

/***/ }
/******/ ]);