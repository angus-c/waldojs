javascript:(function(){
  var traverse = function(task, findMe, root, path){
    var root= root || window;
    var path=path || ((root==window) ? "window" : "");
    var props = Object.keys(root);
    props.forEach(function(each){
      if(tasks[task](root, findMe, each)){
        console.log([path, ".", each].join(""), "->",["(", typeof root[each], ")"].join(""), root[each]);
      }
      if((""+root[each])=="[object Object]" && path.split(".").indexOf(each) == -1){
        traverse(task, findMe, root[each], [path,each].join("."));
      }
    });
  }

  var tasks = {
    'p':function(root, findMe, each) {return findMe == each},
    'i':function(root, findMe, each) {return root[each] instanceof findMe}
  }

  window.find={
    props: function(findMe, root, path) {
      (typeof findMe == 'string') && traverse('p', findMe, root, path);
    },
    instances: function(findMe,root,path) {
      (typeof findMe == 'function') && traverse('i', findMe, root, path);
    }
  }
})();

javascript:(function(){var a=function(d,f,c,g){var c=c||window;var g=g||((c==window)?"window":"");var e=Object.keys(c);e.forEach(function(h){if(b[d](c,f,h)){console.log([g,".",h].join(""),"->",["(",typeof c[h],")"].join(""),c[h])}if((""+c[h])=="[object Object]"&&g.split(".").indexOf(h)==-1){a(d,f,c[h],[g,h].join("."))}})};var b={p:function(c,d,e){return d==e},i:function(c,d,e){return c[e] instanceof d}};window.find={props:function(d,c,e){(typeof d=="string")&&a("p",d,c,e)},instances:function(d,c,e){(typeof d=="function")&&a("i",d,c,e)}}})();