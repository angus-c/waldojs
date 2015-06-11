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

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var _createClass = __webpack_require__(1)['default'];

	var _classCallCheck = __webpack_require__(6)['default'];

	var _Object$defineProperty = __webpack_require__(2)['default'];

	var _Object$assign = __webpack_require__(7)['default'];

	_Object$defineProperty(exports, '__esModule', {
	  value: true
	});

	var GLOBAL = typeof window == 'object' ? window : global;

	var find = {
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
	    // TODO: automate this according to how find is called
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

	// for console running
	GLOBAL.waldo = find;

	exports['default'] = find;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$defineProperty = __webpack_require__(2)["default"];

	exports["default"] = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;

	      _Object$defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	})();

	exports.__esModule = true;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(3), __esModule: true };

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(4);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global = typeof self != 'undefined' ? self : Function('return this')()
	  , core   = {}
	  , defineProperty = Object.defineProperty
	  , hasOwnProperty = {}.hasOwnProperty
	  , ceil  = Math.ceil
	  , floor = Math.floor
	  , max   = Math.max
	  , min   = Math.min;
	// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
	var DESC = !!function(){
	  try {
	    return defineProperty({}, 'a', {get: function(){ return 2; }}).a == 2;
	  } catch(e){ /* empty */ }
	}();
	var hide = createDefiner(1);
	// 7.1.4 ToInteger
	function toInteger(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	}
	function desc(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	}
	function simpleSet(object, key, value){
	  object[key] = value;
	  return object;
	}
	function createDefiner(bitmap){
	  return DESC ? function(object, key, value){
	    return $.setDesc(object, key, desc(bitmap, value));
	  } : simpleSet;
	}

	function isObject(it){
	  return it !== null && (typeof it == 'object' || typeof it == 'function');
	}
	function isFunction(it){
	  return typeof it == 'function';
	}
	function assertDefined(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	}

	var $ = module.exports = __webpack_require__(5)({
	  g: global,
	  core: core,
	  html: global.document && document.documentElement,
	  // http://jsperf.com/core-js-isobject
	  isObject:   isObject,
	  isFunction: isFunction,
	  that: function(){
	    return this;
	  },
	  // 7.1.4 ToInteger
	  toInteger: toInteger,
	  // 7.1.15 ToLength
	  toLength: function(it){
	    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	  },
	  toIndex: function(index, length){
	    index = toInteger(index);
	    return index < 0 ? max(index + length, 0) : min(index, length);
	  },
	  has: function(it, key){
	    return hasOwnProperty.call(it, key);
	  },
	  create:     Object.create,
	  getProto:   Object.getPrototypeOf,
	  DESC:       DESC,
	  desc:       desc,
	  getDesc:    Object.getOwnPropertyDescriptor,
	  setDesc:    defineProperty,
	  setDescs:   Object.defineProperties,
	  getKeys:    Object.keys,
	  getNames:   Object.getOwnPropertyNames,
	  getSymbols: Object.getOwnPropertySymbols,
	  assertDefined: assertDefined,
	  // Dummy, fix for not array-like ES3 string in es5 module
	  ES5Object: Object,
	  toObject: function(it){
	    return $.ES5Object(assertDefined(it));
	  },
	  hide: hide,
	  def: createDefiner(0),
	  set: global.Symbol ? simpleSet : hide,
	  each: [].forEach
	});
	/* eslint-disable no-undef */
	if(typeof __e != 'undefined')__e = core;
	if(typeof __g != 'undefined')__g = global;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function($){
	  $.FW   = false;
	  $.path = $.core;
	  return $;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	exports.__esModule = true;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(8), __esModule: true };

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(9);
	module.exports = __webpack_require__(4).core.Object.assign;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $def = __webpack_require__(10);
	$def($def.S, 'Object', {assign: __webpack_require__(11)});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(4)
	  , global     = $.g
	  , core       = $.core
	  , isFunction = $.isFunction;
	function ctx(fn, that){
	  return function(){
	    return fn.apply(that, arguments);
	  };
	}
	// type bitmap
	$def.F = 1;  // forced
	$def.G = 2;  // global
	$def.S = 4;  // static
	$def.P = 8;  // proto
	$def.B = 16; // bind
	$def.W = 32; // wrap
	function $def(type, name, source){
	  var key, own, out, exp
	    , isGlobal = type & $def.G
	    , isProto  = type & $def.P
	    , target   = isGlobal ? global : type & $def.S
	        ? global[name] : (global[name] || {}).prototype
	    , exports  = isGlobal ? core : core[name] || (core[name] = {});
	  if(isGlobal)source = name;
	  for(key in source){
	    // contains in native
	    own = !(type & $def.F) && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    if(isGlobal && !isFunction(target[key]))exp = source[key];
	    // bind timers to global for call from export context
	    else if(type & $def.B && own)exp = ctx(out, global);
	    // wrap global constructors for prevent change them in library
	    else if(type & $def.W && target[key] == out)!function(C){
	      exp = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      exp.prototype = C.prototype;
	    }(out);
	    else exp = isProto && isFunction(out) ? ctx(Function.call, out) : out;
	    // export
	    exports[key] = exp;
	    if(isProto)(exports.prototype || (exports.prototype = {}))[key] = out;
	  }
	}
	module.exports = $def;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var $        = __webpack_require__(4)
	  , enumKeys = __webpack_require__(12);
	// 19.1.2.1 Object.assign(target, source, ...)
	/* eslint-disable no-unused-vars */
	module.exports = Object.assign || function assign(target, source){
	/* eslint-enable no-unused-vars */
	  var T = Object($.assertDefined(target))
	    , l = arguments.length
	    , i = 1;
	  while(l > i){
	    var S      = $.ES5Object(arguments[i++])
	      , keys   = enumKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)T[key = keys[j++]] = S[key];
	  }
	  return T;
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(4);
	module.exports = function(it){
	  var keys       = $.getKeys(it)
	    , getDesc    = $.getDesc
	    , getSymbols = $.getSymbols;
	  if(getSymbols)$.each.call(getSymbols(it), function(key){
	    if(getDesc(it, key).enumerable)keys.push(key);
	  });
	  return keys;
	};

/***/ }
/******/ ]);