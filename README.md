[![Build Status](https://travis-ci.org/angus-c/waldo.png?branch=master)](http://travis-ci.org/angus-c/waldo)

#Waldo

I got frustrated looking for specific properties and values within JavaScript object trees – so I created a utility to do it.
You search for objects using a find utility. Then you can click on the retrieved objects to inspect them.

##Installation

#####1. Using the npm module

```
npm install waldo
```

#####2. Standalone

Clone this repo and run `make build` to generate the standalone bundles `waldobundle.js` and `waldobundle.min.js`.

##Usage

#####1. Using the npm module

```
// ES 5
var waldo = require('waldo');

// global search for all properties named 'home'
var matches = waldo.byName('home');

// search the react source code for all properties names 'map'
var React = require('react');
var matches = waldo.byName('map', React);
```

```
// ES 6
import waldo from 'waldo';

// global search for properties with values of 1000
const matches = waldo.byValue(1000);

// search an object for all Arrays
const matches = waldo.byType(Array, myObj);
```

#####2. Standalone


#####3. In the Browser Console

You can paste waldobundle.min.js in the console (or make a bookmarklet from it) and then type _waldo_ commands directly in the console. When run in the console _waldo_ outputs its matches in a readable string format.

```js
// show all falsey values
waldo.byValueCoerced(false);

//search with a custom function
//e.g. all truthy properties named 'a'...
find.custom(function(searchTerm, obj, prop) {return (obj[prop] == true) && (prop == 'a')});
```
####circular references

Waldo detects circular references and cites them:

```js
let a = {x: b};
let b = {y: c};
let c = {z: a};
waldo.byName('z');
```

will log...
```
GLOBAL.c.z -> (<global.a>) Object {z: a}
```

Thanks to [John-David Dalton](https://github.com/jdalton) for introducing circular reference detection.

###Testing

To test both module and the standalone bundles:
```
npm test
```

To run continuous tests in watch mode:
```
npm run testc
```
