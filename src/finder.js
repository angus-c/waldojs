javascript:(function(){
  var traverse = function(util, findMe, options) {
    var options = options || {};
    var root = options.root || window;
    var path = options.path || ((root==window) ? "window" : "");
    var props = Object.keys(root);
    props.forEach(function(each) {
      if ((tests[util] || util)(findMe, root, each)){
        console.log([path, ".", each].join(""), "->",["(", typeof root[each], ")"].join(""), root[each]);
      }
      if((""+root[each])=="[object Object]" && (root[each] != root) && path.split(".").indexOf(each) == -1) {
        traverse(util, findMe, {root: root[each], path: [path,each].join(".")});
      }
    });
  }

  var dealWithIt = function(util, expected, findMe, options) {
    (!expected || typeof findMe == expected) ?
      traverse(util, findMe, options) :
      console.error([findMe, 'must be', expected].join(' '));
  }

  var tests = {
    'propName': function(findMe, root, each) {return findMe == each},
    'type': function(findMe, root, each) {return root[each] instanceof findMe},
    'value': function(findMe, root, each) {return root[each] === findMe},
    'valueCoerced': function(findMe, root, each) {return root[each] == findMe}
  }

  window.find={
    byPropName: function(findMe, options) {dealWithIt('propName', 'string', findMe, options);},
    byType: function(findMe, options) {dealWithIt('type', 'function', findMe, options);},
    byValue: function(findMe, options) {dealWithIt('value', null, findMe, options);},
    byValueCoerced: function(findMe, options) {dealWithIt('valueCoerced', null, findMe, options);},
    custom: function(fn, options) {traverse(fn, null, options);}
  }
})();


