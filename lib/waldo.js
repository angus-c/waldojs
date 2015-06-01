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

	(function (global) {
	  function dealWithIt(util, expected, searchTerm, options) {
	    // integrity check arguments
	    !expected || typeof searchTerm == expected ? traverse(util, searchTerm, options) : console.error(searchTerm + ' must be ' + expected);
	  }

	  function traverse(util, searchTerm, options) {
	    util = tests[util] || util;
	    options || (options = {});

	    var data;
	    var alreadySeen;

	    var obj = options.obj || global;
	    var ownProp = options.hasOwnProperty;
	    var path = options.path || (obj == global ? 'global' : '');
	    var queue = [{ 'obj': obj, 'path': path }];
	    var seen = [];

	    // a non-recursive solution to avoid call stack limits
	    // http://www.jslab.dk/articles/non.recursive.preorder.traversal.part4
	    while (data = queue.pop()) {
	      obj = data.obj;
	      path = data.path;

	      for (var prop in obj) {
	        // IE may throw errors when accessing/coercing some properties
	        try {
	          if (ownProp.call(obj, prop)) {
	            // inspect objects
	            if ([obj[prop]] == '[object Object]') {
	              // check if already searched (prevents circular references)
	              for (var i = -1; seen[++i] && !(alreadySeen = like(seen[i].obj, obj[prop]) && seen[i]););
	              // add to stack
	              if (!alreadySeen) {
	                data = { 'obj': obj[prop], 'path': path + '.' + prop };
	                queue.push(data);
	                seen.push(data);
	              }
	            }
	            // if match detected, log it
	            if (util(searchTerm, obj, prop)) {
	              console.log(path + '.' + prop, '->', '(' + (alreadySeen ? '<' + alreadySeen.path + '>' : typeof obj[prop]) + ')', obj[prop]);
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
	    'propName': function propName(searchTerm, obj, prop) {
	      return searchTerm == prop;
	    },
	    'type': function type(searchTerm, obj, prop) {
	      return obj[prop] instanceof searchTerm;
	    },
	    'value': function value(searchTerm, obj, prop) {
	      return obj[prop] === searchTerm;
	    },
	    'valueCoerced': function valueCoerced(searchTerm, obj, prop) {
	      return obj[prop] == searchTerm;
	    }
	  };

	  // expose
	  global.find = {
	    'byName': function byName(searchTerm, options) {
	      dealWithIt('propName', 'string', searchTerm, options);
	    },
	    'byType': function byType(searchTerm, options) {
	      dealWithIt('type', 'function', searchTerm, options);
	    },
	    'byValue': function byValue(searchTerm, options) {
	      dealWithIt('value', null, searchTerm, options);
	    },
	    'byValueCoerced': function byValueCoerced(searchTerm, options) {
	      dealWithIt('valueCoerced', null, searchTerm, options);
	    },
	    'custom': function custom(fn, options) {
	      traverse(fn, null, options);
	    }
	  };
	})(window || global);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ]);