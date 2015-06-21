[![Build Status](https://travis-ci.org/angus-c/waldojs.png?branch=master)](http://travis-ci.org/angus-c/waldojs) [![npm version](http://img.shields.io/npm/v/waldojs.svg)](https://npmjs.org/package/waldojs) [![Dependency Status] (https://david-dm.org/angus-c/waldojs)] (https://david-dm.org/angus-c/waldojs.svg)

# WaldoJS

I got frustrated looking for specific properties and values within JavaScript object trees — so I created a utility to do it for me.

Waldo lets you search globally or within specificied objects. You can search by property name, property type or property value. You can also create your own custom search functions. Waldo can be run as an [npm module](https://github.com/angus-c/waldo/tree/output_objects#1-using-the-npm-module), or a [global file](https://github.com/angus-c/waldo/tree/output_objects#2-standalone) and there's also an autogenerated [bookmarklet](https://github.com/angus-c/waldo/tree/output_objects#3-using-the-bookmarklet-in-the-browser-console) you can use for quick checks in the console.

## Overview

A waldo search returns an array of Match objects...

```js
var waldo = require('waldojs');

// find react properties named 'oneOfType'
var React = require('react');
var matches = waldo.byName('oneOfType', React);  

matches[0].path; // 'SRC.PropTypes.oneOfType'
matches[0].value; // [the function]
matches[0].type; // 'function'
```

Running `log` over a Match, or all matches, returns a formatted text summary.

```js
// global search for objects with a value of 10
waldo.byValue(10).log(); // =>
  GLOBAL.module.exports.repl._maxListeners -> (number) 10
  GLOBAL.module.exports.repl.rli._maxListeners -> (number) 10
  GLOBAL.module.exports.repl.outputStream._maxListeners -> (number) 10
  GLOBAL.module.exports.repl.inputStream._maxListeners -> (number) 10
```

If you use a transpiler like babel you could interact with waldo in ES 6. (Waldo is itself written in ES 6).

```js
// use a destructure assignment to find a nested pattern
const obj = {a: {a: 3, b: {c: 4, a: {a: {b: 4}}}}};
const matches = find.custom(
  (what, obj, prop) => {
  let {a: {b: x}} = obj[prop];
  return x === 4;
}, obj);
matches.log(); // 'SRC.a.b.a -> (object) {a: {b: 4}}'
```

## Installation and Usage

### 1. Using the npm module

```
npm install waldojs
```

then

```js
var waldo = require('waldojs'); // ES 5
```

or

```js
import  waldo  from 'waldojs'; // ES 6
```

### 2. Standalone

Clone this repo and run `make build` to generate the standalone bundles `waldobundle.js` and `waldobundle.min.js`. The global `waldo` object will now be available to you.

### 3. Using the Bookmarklet in the Browser Console

By using the supplied bookmarklet (`lib/bookmarklet.txt` - you'll need to run `make build` if it isn't there) you can type waldo commands directly in the console.  When run in the console waldo auto-logs all matches.

## Output

### Match

Every time waldo finds an object that matches the search criteria, a `Match` object is created. Each call to waldo returns an array of `Match` objects.

A `Match` instance has the following properties

* `path` the property path to reach the matching object.
* `prop` the name of the matching object.
* `value` the value of the matching object.
* `obj` the matching object
* `log` function that returns a formatted string representation of the match (the array of matches also has a `log` function that returns a formatted string of all matches).

## API

Waldo accepts a variety of query methods.

* `byName` search the object tree for properties with this name
* `byValue` search the object tree for properties with this value
* `byValueCoerced` search the object tree for properties that == this value
* `byType` search the object tree for properties that are an instance of the given
  class/constructor.
* `custom` supply a custom search function

Each method accepts up to 2 arguments:

* `what` (required) the property, value or type to match on
* `where` (optional - default is the global object) the root of the search

### byName

```js
// Find properties named 'read' anywhere
var matches = waldo.byName('read');
matches.length; // 1
matches[0].value; // [the function]
matches[0].log(); // =>
  'GLOBAL.module.exports.repl.inputStream.read -> (function) [object Function]'
```

### byValue
```js
// Global search for all properties with the value 10
var matches = waldo.byValue(10);
matches.length // => 4;

// return the results as a formatted string...
// (when running globally these logs appear in the console by default)
matches.log(); // =>
  GLOBAL.module.exports.repl._maxListeners -> (number) 10
  GLOBAL.module.exports.repl.rli._maxListeners -> (number) 10
  GLOBAL.module.exports.repl.outputStream._maxListeners -> (number) 10
  GLOBAL.module.exports.repl.inputStream._maxListeners -> (number) 10
```

### byValueCoerced

```js
// get all falsey values globally
waldo.byValueCoerced(false); // =>
  GLOBAL.deviceIsAndroid -> (boolean) false
  GLOBAL.deviceIsIOS -> (boolean) false
  GLOBAL.defaultstatus -> (string) ''
  GLOBAL.GitHub.support.setImmediate -> (boolean) false
  GLOBAL.chrome.app.isInstalled -> (boolean) false
  etc..
```

### byType
```js
var a = {
  aa: ['x', 'y', 'z'],
  bb: {
    bbb: [1, 2, 3],
    ccc: 54
  }
};

waldo.byType(Array, a); // =>
  SRC.aa -> (object) x,y,z
  SRC.bb.bbb -> (object) 1,2,3
```

### Custom

The `custom` method takes 2 arguments:
* `fn` - function specifying match criteria
* `where` (optional) -where to search

```js
// find all true values beginning with 'c'
var vegetables = {
  carrots: {
    chopped: false,
    cleaned: true
  }
  leaks: {
    chopped: true,
    cleaned: false
  }
};

waldo.custom(function(what, obj, prop) {
  return (obj[prop] === true) && (!prop.indexOf('c'));
}, vegetables); // =>
  SRC.leaks.chopped -> (boolean) true
  SRC.carrots.cleaned -> (boolean) true
```

## Circular References

Waldo detects circular references and cites them:

```js
var a = {x: b};
var b = {y: c};
var c = {z: a};
waldo.byName('z');
```

will log...
```
GLOBAL.c.z -> (<GLOBAL.a>) {z: a}
```

Thanks to [John-David Dalton](https://github.com/jdalton) for adding circular reference detection as well as providing some early refactor commits.

## Testing

To test both module and the standalone bundles:
```
npm test
```

To run continuous tests in watch mode:
```
npm run testc
```
