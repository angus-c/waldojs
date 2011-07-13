/*
Copyright (C) 2011 by Angus Croll
http://javascriptweblog.wordpress.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function(){
  var traverse = function(util, searchTerm, options) {
    var options = options || {};
    var obj = options.obj || window;
    var path = options.path || ((obj==window) ? "window" : "");
    var props = Object.keys(obj);
    props.forEach(function(prop) {
      if ((tests[util] || util)(searchTerm, obj, prop)){
        console.log([path, ".", prop].join(""), "->",["(", typeof obj[prop], ")"].join(""), obj[prop]);
      }
      if((""+obj[prop])=="[object Object]" && (obj[prop] != obj) && path.split(".").indexOf(prop) == -1) {
        traverse(util, searchTerm, {obj: obj[prop], path: [path,prop].join(".")});
      }
    });
  }

  var dealWithIt = function(util, expected, searchTerm, options) {
    (!expected || typeof searchTerm == expected) ?
      traverse(util, searchTerm, options) :
      console.error([searchTerm, 'must be', expected].join(' '));
  }

  var tests = {
    'name': function(searchTerm, obj, prop) {searchTerm == prop},
    'nameContains': function(searchTerm, obj, prop) {prop.indexOf(searchTerm)>-1},
    'type': function(searchTerm, obj, prop) {return obj[prop] instanceof searchTerm},
    'value': function(searchTerm, obj, prop) {return obj[prop] === searchTerm},
    'valueCoerced': function(searchTerm, obj, prop) {return obj[prop] == searchTerm}
  }

  window.find={
    byName: function(searchTerm, options) {dealWithIt('name', 'string', searchTerm, options);},
    byNameContains: function(searchTerm, options) {dealWithIt('nameContains', 'string', searchTerm, options);},
    byType: function(searchTerm, options) {dealWithIt('type', 'function', searchTerm, options);},
    byValue: function(searchTerm, options) {dealWithIt('value', null, searchTerm, options);},
    byValueCoerced: function(searchTerm, options) {dealWithIt('valueCoerced', null, searchTerm, options);},
    custom: function(fn, options) {traverse(fn, null, options);}
  }
})();
