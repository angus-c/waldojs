[![Build Status](https://travis-ci.org/angus-c/waldo.png?branch=master)](http://travis-ci.org/angus-c/waldo)

###Waldo

I got frustrated trying to find objects in runtime object models – so I created a utility to do it.
You search for objects using a find utility. Then you can click on the retrieved objects to inspect them.

e.g. in the console do this kind of thing

```js
//global search for all properties named 'home'
find.byName('home');

//search jquery for all properties named 'map'
find.byName('map', {obj: jQuery, path: 'jQuery'})

//global search for all property names containing 'box' as a substring
find.byNameContains('box');

//global search for all arrays
find.byType(Array)

//all instances with value 1000
find.byValue(1000);

//all falsey values
find.byValueCoerced(false);

//search with a custom function
//e.g. all truthy properties named 'a'...
find.custom(function(searchTerm, obj, prop) {return (obj[prop] == true) && (prop == 'a')});
```
####circular references

Waldo now detects circular references and cites them:  

```js
var a = {b: 3};
var c = {d: a};
find.byName('d');
```

will log...  
```
global.c.d -> (<global.a>) Object {b: 3} 
```

Thanks to [John-David Dalton](https://github.com/jdalton) for infrastructure improvements.
