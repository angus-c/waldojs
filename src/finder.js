javascript:(function(){
  var traverse = function(util, findMe, options) {
    var options = options || {};
    var root = options.root || window;
    var path = options.path || ((root==window) ? "window" : "");
    var props = Object.keys(root);
    props.forEach(function(each) {
      if (tests[util](findMe, root, each)){
        console.log([path, ".", each].join(""), "->",["(", typeof root[each], ")"].join(""), root[each]);
      }
      if((""+root[each])=="[object Object]" && (root[each] != root) && path.split(".").indexOf(each) == -1) {
        traverse(util, findMe, {root: root[each], path: [path,each].join(".")});
      }
    });
  }

  var tests = {
    'props': function(findMe, root, each) {return findMe == each},
    'instances': function(findMe, root, each) {return root[each] instanceof findMe},
    'values': function(findMe, root, each) {return root[each] === findMe},
    'valuesCoerced': function(findMe, root, each) {return root[each] == findMe}
  }

  var dealWithIt = function(util, expected, findMe, options) {
    (!expected || typeof findMe == expected) ?
      traverse(util, findMe, options) :
      console.error([findMe, 'must be', expected].join(' '));
  }

  window.find={
    props: function(findMe, options) {dealWithIt('props', 'string', findMe, options);},
    instances: function(findMe, options) {dealWithIt('instances', 'function', findMe, options);},
    values: function(findMe, options) {dealWithIt('values', null, findMe, options);},
    valuesCoerced: function(findMe, options) {dealWithIt('valuesCoerced', null, findMe, options);}
  }
})();


