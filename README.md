###Waldo

see http://javascriptweblog.wordpress.com/2011/07/11/waldo-search-the-javascript-runtime-in-under-1-kb/

I got frustrated trying to find objects in runtime object models - so I created a utility to do it.
You search for objects using a find utility. Then you can click on the retrieved objects to inspect them

e.g. in the console do this kind of thing

```js
//global search for all properties named 'home'
find.byName('home');

//search jquery for all properties named 'map'
find.byName('map', jQuery, 'jQuery')

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
find.custom(function(searchTerm, obj, prop) {return (obj[prop] == true) && (prop == 'a')});```
